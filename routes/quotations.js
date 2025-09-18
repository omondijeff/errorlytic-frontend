const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware, requireRole } = require("../middleware/auth");
const quotationService = require("../services/quotationService");

const router = express.Router();

// @route   POST /api/v1/quotations/generate/:analysisId
// @desc    Generate quotation from analysis and walkthrough
// @access  Private (Garage users only)
router.post(
  "/generate/:analysisId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  [
    body("currency")
      .optional()
      .isIn(["KES", "UGX", "TZS", "USD"])
      .withMessage("Invalid currency"),
    body("laborRate")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Labor rate must be a positive number"),
    body("markupPct")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Markup percentage must be between 0 and 100"),
    body("taxPct")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Tax percentage must be between 0 and 100"),
    body("useOEMParts")
      .optional()
      .isBoolean()
      .withMessage("useOEMParts must be a boolean"),
    body("notes")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Notes must be less than 1000 characters"),
  ],
  async (req, res) => {
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

    try {
      const { analysisId } = req.params;
      const options = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await quotationService.generateQuotation(
        analysisId,
        options,
        userId,
        orgId
      );

      res.status(201).json({
        type: "quotation_generated",
        title: "Quotation Generated Successfully",
        detail: result.message,
        data: result.quotation,
      });
    } catch (error) {
      console.error("Error generating quotation:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   GET /api/v1/quotations/:quotationId
// @desc    Get quotation by ID
// @access  Private
router.get("/:quotationId", authMiddleware, async (req, res) => {
  try {
    const { quotationId } = req.params;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await quotationService.getQuotation(
      quotationId,
      userId,
      orgId
    );

    res.status(200).json({
      type: "quotation_retrieved",
      title: "Quotation Retrieved Successfully",
      data: result.quotation,
    });
  } catch (error) {
    console.error("Error retrieving quotation:", error);
    res.status(404).json({
      type: "quotation_not_found",
      title: "Quotation Not Found",
      detail: error.message,
    });
  }
});

// @route   GET /api/v1/quotations
// @desc    Get quotations with pagination and filtering
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const orgId = req.user.orgId;
    const { page = 1, limit = 10, status, currency } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (currency) filters.currency = currency;

    const result = await quotationService.getQuotations(
      userId,
      orgId,
      filters,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      type: "quotations_retrieved",
      title: "Quotations Retrieved Successfully",
      data: result.quotations,
      meta: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    console.error("Error retrieving quotations:", error);
    res.status(500).json({
      type: "internal_server_error",
      title: "Internal Server Error",
      detail: error.message,
    });
  }
});

// @route   PUT /api/v1/quotations/:quotationId
// @desc    Update quotation
// @access  Private (Garage users only)
router.put(
  "/:quotationId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  [
    body("labor.hours")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Labor hours must be a positive number"),
    body("labor.ratePerHour")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Labor rate must be a positive number"),
    body("parts").optional().isArray().withMessage("Parts must be an array"),
    body("parts.*.name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Part name is required"),
    body("parts.*.unitPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Unit price must be a positive number"),
    body("parts.*.qty")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("taxPct")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Tax percentage must be between 0 and 100"),
    body("markupPct")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Markup percentage must be between 0 and 100"),
    body("notes")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Notes must be less than 1000 characters"),
  ],
  async (req, res) => {
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

    try {
      const { quotationId } = req.params;
      const updates = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await quotationService.updateQuotation(
        quotationId,
        updates,
        userId,
        orgId
      );

      res.status(200).json({
        type: "quotation_updated",
        title: "Quotation Updated Successfully",
        detail: result.message,
        data: result.quotation,
      });
    } catch (error) {
      console.error("Error updating quotation:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   POST /api/v1/quotations/:quotationId/status
// @desc    Update quotation status
// @access  Private (Garage users only)
router.post(
  "/:quotationId/status",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  [
    body("status")
      .isIn(["draft", "sent", "approved", "rejected"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
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

    try {
      const { quotationId } = req.params;
      const { status } = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await quotationService.updateQuotationStatus(
        quotationId,
        status,
        userId,
        orgId
      );

      res.status(200).json({
        type: "quotation_status_updated",
        title: "Quotation Status Updated Successfully",
        detail: result.message,
        data: result.quotation,
      });
    } catch (error) {
      console.error("Error updating quotation status:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   POST /api/v1/quotations/:quotationId/share
// @desc    Generate shareable link for quotation
// @access  Private (Garage users only)
router.post(
  "/:quotationId/share",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  async (req, res) => {
    try {
      const { quotationId } = req.params;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await quotationService.generateShareLink(
        quotationId,
        userId,
        orgId
      );

      res.status(200).json({
        type: "share_link_generated",
        title: "Share Link Generated Successfully",
        detail: result.message,
        data: {
          shareLinkId: result.shareLinkId,
          shareUrl: result.shareUrl,
        },
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   GET /api/v1/quotations/share/:shareLinkId
// @desc    Get quotation by share link (public access)
// @access  Public
router.get("/share/:shareLinkId", async (req, res) => {
  try {
    const { shareLinkId } = req.params;

    const result = await quotationService.getQuotationByShareLink(shareLinkId);

    res.status(200).json({
      type: "quotation_retrieved",
      title: "Quotation Retrieved Successfully",
      data: result.quotation,
    });
  } catch (error) {
    console.error("Error retrieving quotation by share link:", error);
    res.status(404).json({
      type: "quotation_not_found",
      title: "Quotation Not Found",
      detail: error.message,
    });
  }
});

// @route   GET /api/v1/quotations/statistics
// @desc    Get quotation statistics
// @access  Private
router.get("/statistics", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await quotationService.getQuotationStatistics(userId, orgId);

    res.status(200).json({
      type: "quotation_statistics",
      title: "Quotation Statistics Retrieved Successfully",
      data: result.statistics,
    });
  } catch (error) {
    console.error("Error retrieving quotation statistics:", error);
    res.status(500).json({
      type: "internal_server_error",
      title: "Internal Server Error",
      detail: error.message,
    });
  }
});

// @route   DELETE /api/v1/quotations/:quotationId
// @desc    Delete quotation
// @access  Private (Garage users only)
router.delete(
  "/:quotationId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  async (req, res) => {
    try {
      const { quotationId } = req.params;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await quotationService.deleteQuotation(
        quotationId,
        userId,
        orgId
      );

      res.status(200).json({
        type: "quotation_deleted",
        title: "Quotation Deleted Successfully",
        detail: result.message,
      });
    } catch (error) {
      console.error("Error deleting quotation:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   GET /api/v1/quotations/:quotationId/export
// @desc    Export quotation as PDF (placeholder)
// @access  Private
router.get("/:quotationId/export", authMiddleware, async (req, res) => {
  try {
    const { quotationId } = req.params;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await quotationService.exportQuotationPDF(
      quotationId,
      userId,
      orgId
    );

    res.status(501).json({
      type: "not_implemented",
      title: "PDF Export Not Implemented",
      detail: result.message,
    });
  } catch (error) {
    console.error("Error exporting quotation:", error);
    res.status(500).json({
      type: "internal_server_error",
      title: "Internal Server Error",
      detail: error.message,
    });
  }
});

module.exports = router;
