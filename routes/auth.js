const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Organization = require("../models/Organization");
const {
  authMiddleware,
  requireRole,
  superadminMiddleware,
} = require("../middleware/auth");

const router = express.Router();

// Generate JWT tokens (access + refresh)
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Short-lived access token
  });

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // Long-lived refresh token
    }
  );

  return { accessToken, refreshToken };
};

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - profile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123
 *               profile:
 *                 type: object
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   phone:
 *                     type: string
 *                     example: +254712345678
 *               role:
 *                 type: string
 *                 enum: [individual, garage_user, garage_admin, insurer_user, insurer_admin]
 *                 default: individual
 *                 example: individual
 *               orgId:
 *                 type: string
 *                 description: Organization ID (required for non-individual roles)
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               type: user_created
 *               title: User Created Successfully
 *               detail: User account has been created successfully
 *               data:
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   email: user@example.com
 *                   role: individual
 *                   profile:
 *                     name: John Doe
 *                   isActive: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    body("profile.name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("role")
      .optional()
      .isIn([
        "individual",
        "garage_user",
        "garage_admin",
        "insurer_user",
        "insurer_admin",
      ])
      .withMessage("Invalid role"),
    body("orgId").optional().isMongoId().withMessage("Invalid organization ID"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const { email, password, profile, role = "individual", orgId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          type: "user_exists",
          title: "User Already Exists",
          detail: "A user with this email already exists",
          status: 400,
        });
      }

      // Validate organization if provided
      if (orgId) {
        const org = await Organization.findById(orgId);
        if (!org) {
          return res.status(400).json({
            type: "invalid_organization",
            title: "Invalid Organization",
            detail: "The specified organization does not exist",
            status: 400,
          });
        }
      }

      // Create new user
      const user = new User({
        email,
        passwordHash: password, // Will be hashed by pre-save middleware
        profile,
        role,
        orgId,
      });

      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            profile: user.profile,
            role: user.role,
            orgId: user.orgId,
            plan: user.plan,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred during registration",
        status: 500,
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password, returns access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               type: login_successful
 *               title: Login Successful
 *               detail: User authenticated successfully
 *               data:
 *                 user:
 *                   _id: 507f1f77bcf86cd799439011
 *                   email: user@example.com
 *                   role: individual
 *                   profile:
 *                     name: John Doe
 *                 tokens:
 *                   accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          type: "invalid_credentials",
          title: "Invalid Credentials",
          detail: "Invalid email or password",
          status: 401,
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          type: "account_deactivated",
          title: "Account Deactivated",
          detail: "Your account has been deactivated",
          status: 401,
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          type: "invalid_credentials",
          title: "Invalid Credentials",
          detail: "Invalid email or password",
          status: 401,
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            profile: user.profile,
            role: user.role,
            orgId: user.orgId,
            plan: user.plan,
            quotas: user.quotas,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred during login",
        status: 500,
      });
    }
  }
);

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      if (decoded.type !== "refresh") {
        return res.status(401).json({
          type: "invalid_token",
          title: "Invalid Token",
          detail: "Invalid refresh token",
          status: 401,
        });
      }

      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          type: "invalid_token",
          title: "Invalid Token",
          detail: "User not found or deactivated",
          status: 401,
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user._id
      );

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({
          type: "invalid_token",
          title: "Invalid Token",
          detail: "Invalid or expired refresh token",
          status: 401,
        });
      }

      console.error("Token refresh error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred during token refresh",
        status: 500,
      });
    }
  }
);

// @route   GET /api/v1/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          profile: req.user.profile,
          role: req.user.role,
          orgId: req.user.orgId,
          organization: req.user.organization,
          plan: req.user.plan,
          quotas: req.user.quotas,
          isActive: req.user.isActive,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "An error occurred while fetching profile",
      status: 500,
    });
  }
});

// @route   PUT /api/v1/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authMiddleware,
  [
    body("profile.name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("profile.phone").optional().trim(),
    body("profile.country").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const { profile } = req.body;
      const updateFields = {};

      if (profile) {
        if (profile.name) updateFields["profile.name"] = profile.name;
        if (profile.phone !== undefined)
          updateFields["profile.phone"] = profile.phone;
        if (profile.country !== undefined)
          updateFields["profile.country"] = profile.country;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateFields,
        { new: true, runValidators: true }
      ).select("-passwordHash");

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred while updating profile",
        status: 500,
      });
    }
  }
);

// @route   POST /api/v1/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "New password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          type: "invalid_password",
          title: "Invalid Password",
          detail: "Current password is incorrect",
          status: 400,
        });
      }

      // Update password
      user.passwordHash = newPassword; // Will be hashed by pre-save middleware
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred while changing password",
        status: 500,
      });
    }
  }
);

// @route   POST /api/v1/orgs
// @desc    Create organization (admin only)
// @access  Private (Admin)
router.post(
  "/orgs",
  superadminMiddleware,
  [
    body("type")
      .isIn(["garage", "insurer"])
      .withMessage("Organization type must be garage or insurer"),
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Organization name must be at least 2 characters long"),
    body("country")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Country must be at least 2 characters long"),
    body("currency")
      .optional()
      .isIn(["KES", "UGX", "TZS", "USD"])
      .withMessage("Invalid currency"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Failed",
          detail: "Invalid input data",
          status: 400,
          errors: errors.array(),
        });
      }

      const {
        type,
        name,
        country,
        currency = "KES",
        contact,
        settings,
      } = req.body;

      const organization = new Organization({
        type,
        name,
        country,
        currency,
        contact,
        settings,
      });

      await organization.save();

      res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: {
          organization,
        },
      });
    } catch (error) {
      console.error("Organization creation error:", error);
      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "An error occurred while creating organization",
        status: 500,
      });
    }
  }
);

// @route   GET /api/v1/orgs/:id
// @desc    Get organization details
// @access  Private
router.get("/orgs/:id", authMiddleware, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        type: "not_found",
        title: "Organization Not Found",
        detail: "The specified organization does not exist",
        status: 404,
      });
    }

    // Check if user has access to this organization
    if (
      req.user.role !== "superadmin" &&
      req.user.orgId?.toString() !== req.params.id
    ) {
      return res.status(403).json({
        type: "access_denied",
        title: "Access Denied",
        detail: "You don't have permission to access this organization",
        status: 403,
      });
    }

    res.json({
      success: true,
      data: {
        organization,
      },
    });
  } catch (error) {
    console.error("Organization fetch error:", error);
    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "An error occurred while fetching organization",
      status: 500,
    });
  }
});

module.exports = router;
