const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Quotation = require("../models/Quotation");
const ErrorCode = require("../models/ErrorCode");
// TODO: Uncomment when OpenAI API key is configured
// const { generateAIExplanation } = require("../services/openaiService");

const router = express.Router();

// @route   POST /api/quotations
// @desc    Create a new quotation
// @access  Private
router.post(
  "/",
  [
    body("vehicleInfo.make")
      .isIn(["Volkswagen", "Audi", "Porsche", "Skoda", "Seat", "Fiat"])
      .withMessage("Invalid vehicle make"),
    body("vehicleInfo.model")
      .trim()
      .notEmpty()
      .withMessage("Vehicle model is required"),
    body("vehicleInfo.year")
      .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
      .withMessage("Invalid vehicle year"),
    body("vehicleInfo.vin")
      .optional()
      .trim()
      .isLength({ min: 17, max: 17 })
      .withMessage("VIN must be 17 characters long"),
    body("vehicleInfo.mileage")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive number"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const quotationData = {
        user: req.user._id,
        ...req.body,
      };

      const quotation = new Quotation(quotationData);
      await quotation.save();

      res.status(201).json({
        success: true,
        message: "Quotation created successfully",
        data: { quotation },
      });
    } catch (error) {
      console.error("Quotation creation error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error while creating quotation",
      });
    }
  }
);

// @route   GET /api/quotations
// @desc    Get all quotations for the authenticated user
// @access  Private
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["draft", "pending", "approved", "rejected", "completed"])
      .withMessage("Invalid status"),
    query("make")
      .optional()
      .isIn(["Volkswagen", "Audi", "Porsche", "Skoda", "Seat", "Fiat"])
      .withMessage("Invalid vehicle make"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { page = 1, limit = 10, status, make } = req.query;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = { user: req.user._id, isActive: true };
      if (status) filter.status = status;
      if (make) filter["vehicleInfo.make"] = make;

      const quotations = await Quotation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "firstName lastName email");

      const total = await Quotation.countDocuments(filter);

      res.json({
        success: true,
        data: {
          quotations,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Quotations fetch error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error while fetching quotations",
      });
    }
  }
);

// @route   GET /api/quotations/:id
// @desc    Get a specific quotation by ID
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    }).populate("user", "firstName lastName email");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    res.json({
      success: true,
      data: { quotation },
    });
  } catch (error) {
    console.error("Quotation fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching quotation",
    });
  }
});

// @route   PUT /api/quotations/:id
// @desc    Update a quotation
// @access  Private
router.put(
  "/:id",
  [
    body("vehicleInfo.make")
      .optional()
      .isIn(["Volkswagen", "Audi", "Porsche", "Skoda", "Seat", "Fiat"])
      .withMessage("Invalid vehicle make"),
    body("vehicleInfo.model")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Vehicle model cannot be empty"),
    body("vehicleInfo.year")
      .optional()
      .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
      .withMessage("Invalid vehicle year"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const quotation = await Quotation.findOne({
        _id: req.params.id,
        user: req.user._id,
        isActive: true,
      });

      if (!quotation) {
        return res.status(404).json({
          success: false,
          error: "Quotation not found",
        });
      }

      // Only allow updates if quotation is in draft status
      if (quotation.status !== "draft") {
        return res.status(400).json({
          success: false,
          error: "Cannot update quotation that is not in draft status",
        });
      }

      const updatedQuotation = await Quotation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate("user", "firstName lastName email");

      res.json({
        success: true,
        message: "Quotation updated successfully",
        data: { quotation: updatedQuotation },
      });
    } catch (error) {
      console.error("Quotation update error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error while updating quotation",
      });
    }
  }
);

// @route   DELETE /api/quotations/:id
// @desc    Delete a quotation (soft delete)
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    // Only allow deletion if quotation is in draft status
    if (quotation.status !== "draft") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete quotation that is not in draft status",
      });
    }

    quotation.isActive = false;
    await quotation.save();

    res.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error("Quotation deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while deleting quotation",
    });
  }
});

// @route   POST /api/quotations/:id/process-vcds
// @desc    Process VCDS report and extract error codes
// @access  Private
router.post("/:id/process-vcds", async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    if (!quotation.vcdsReport) {
      return res.status(400).json({
        success: false,
        error: "No VCDS report uploaded for this quotation",
      });
    }

    // Extract error codes from VCDS report
    // This is a simplified example - in practice, you'd parse the actual VCDS file
    const extractedErrorCodes = await extractErrorCodesFromVCDS(
      quotation.vcdsReport
    );

    // Get detailed information for each error code
    const processedErrorCodes = [];

    for (const errorCode of extractedErrorCodes) {
      // Find error code in database
      let errorCodeInfo = await ErrorCode.findOne({ code: errorCode.code });

      if (!errorCodeInfo) {
        // If not found, create a basic entry
        errorCodeInfo = {
          code: errorCode.code,
          description: errorCode.description || "Unknown error code",
          severity: "medium",
          category: "Other",
          estimatedCostKes: 10000,
          laborHours: 2,
        };
      }

      // Generate AI explanation
      const aiExplanation = await generateAIExplanation(
        errorCode.code,
        errorCode.description,
        quotation.vehicleInfo.make,
        quotation.vehicleInfo.model
      );

      processedErrorCodes.push({
        code: errorCode.code,
        description: errorCode.description || errorCodeInfo.description,
        severity: errorCodeInfo.severity,
        aiExplanation,
        estimatedRepairTime: errorCodeInfo.estimatedRepairTime,
        estimatedCost: errorCodeInfo.estimatedCostKes,
        parts: errorCodeInfo.partsRequired || [],
        laborHours: errorCodeInfo.laborHours,
      });
    }

    // Update quotation with processed error codes
    quotation.errorCodes = processedErrorCodes;
    quotation.status = "pending";
    await quotation.save();

    res.json({
      success: true,
      message: "VCDS report processed successfully",
      data: {
        errorCodes: processedErrorCodes,
        quotation,
      },
    });
  } catch (error) {
    console.error("VCDS processing error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while processing VCDS report",
    });
  }
});

// @route   POST /api/quotations/:id/approve
// @desc    Approve a quotation
// @access  Private (Admin/Mechanic)
router.post("/:id/approve", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    if (quotation.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Quotation must be in pending status to be approved",
      });
    }

    quotation.status = "approved";
    await quotation.save();

    res.json({
      success: true,
      message: "Quotation approved successfully",
      data: { quotation },
    });
  } catch (error) {
    console.error("Quotation approval error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while approving quotation",
    });
  }
});

// Helper function to extract error codes from VCDS report
async function extractErrorCodesFromVCDS(vcdsReport) {
  // This is a placeholder implementation
  // In practice, you would parse the actual VCDS file format
  // and extract error codes, descriptions, and other diagnostic information

  // For now, return some sample error codes
  return [
    {
      code: "P0300",
      description: "Random/Multiple Cylinder Misfire Detected",
    },
    {
      code: "P0171",
      description: "System Too Lean (Bank 1)",
    },
  ];
}

module.exports = router;
