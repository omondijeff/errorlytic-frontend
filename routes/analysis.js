const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  authMiddleware,
  requireRole,
  requireOrgAccess,
} = require("../middleware/auth");
const analysisService = require("../services/analysisService");
const Metering = require("../models/Metering");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

// @route   POST /api/v1/analysis/process/:uploadId
// @desc    Process uploaded VCDS/OBD report and create analysis
// @access  Private (Garage users)
router.post(
  "/process/:uploadId",
  authMiddleware,
  requireOrgAccess(["garage"]),
  async (req, res) => {
    try {
      const { uploadId } = req.params;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      // Validate upload ID
      if (!uploadId) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Error",
          detail: "Upload ID is required",
          instance: "/api/v1/analysis/process/:uploadId",
        });
      }

      // Process the analysis
      const result = await analysisService.processAnalysis(
        uploadId,
        userId,
        orgId
      );

      res.status(201).json({
        success: true,
        message: "Analysis processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Analysis processing error:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({
          type: "upload_not_found",
          title: "Upload Not Found",
          detail: error.message,
          instance: "/api/v1/analysis/process/:uploadId",
        });
      }

      if (error.message.includes("Parse failed")) {
        return res.status(400).json({
          type: "parse_error",
          title: "Parse Error",
          detail: error.message,
          instance: "/api/v1/analysis/process/:uploadId",
        });
      }

      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "Failed to process analysis",
      });
    }
  }
);

// @route   GET /api/v1/analysis/:analysisId
// @desc    Get analysis by ID
// @access  Private
router.get("/:analysisId", authMiddleware, async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await analysisService.getAnalysis(analysisId, userId, orgId);

    res.json({
      success: true,
      data: result.analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        type: "analysis_not_found",
        title: "Analysis Not Found",
        detail: error.message,
        instance: "/api/v1/analysis/:analysisId",
      });
    }

    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "Failed to retrieve analysis",
    });
  }
});

// @route   GET /api/v1/analysis
// @desc    Get analyses for user/organization
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const orgId = req.user.orgId;
    const filters = req.query;

    const result = await analysisService.getAnalyses(userId, orgId, filters);

    res.json({
      success: true,
      data: result.analyses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get analyses error:", error);
    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "Failed to retrieve analyses",
    });
  }
});

// @route   PUT /api/v1/analysis/:analysisId/status
// @desc    Update analysis status
// @access  Private
router.put(
  "/:analysisId/status",
  authMiddleware,
  [
    body("status")
      .isIn(["pending", "processing", "completed", "failed", "cancelled"])
      .withMessage("Invalid status value"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          type: "validation_error",
          title: "Validation Error",
          detail: errors.array()[0].msg,
          instance: "/api/v1/analysis/:analysisId/status",
        });
      }

      const { analysisId } = req.params;
      const { status } = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await analysisService.updateAnalysisStatus(
        analysisId,
        userId,
        orgId,
        status
      );

      res.json({
        success: true,
        message: "Analysis status updated successfully",
        data: result.analysis,
      });
    } catch (error) {
      console.error("Update analysis status error:", error);

      if (error.message.includes("not found")) {
        return res.status(404).json({
          type: "analysis_not_found",
          title: "Analysis Not Found",
          detail: error.message,
          instance: "/api/v1/analysis/:analysisId/status",
        });
      }

      res.status(500).json({
        type: "internal_error",
        title: "Internal Server Error",
        detail: "Failed to update analysis status",
      });
    }
  }
);

// @route   DELETE /api/v1/analysis/:analysisId
// @desc    Delete analysis
// @access  Private
router.delete("/:analysisId", authMiddleware, async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await analysisService.deleteAnalysis(
      analysisId,
      userId,
      orgId
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete analysis error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        type: "analysis_not_found",
        title: "Analysis Not Found",
        detail: error.message,
        instance: "/api/v1/analysis/:analysisId",
      });
    }

    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "Failed to delete analysis",
    });
  }
});

// @route   GET /api/v1/analysis/statistics/dashboard
// @desc    Get analysis statistics for dashboard
// @access  Private
router.get("/statistics/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await analysisService.getAnalysisStatistics(userId, orgId);

    res.json({
      success: true,
      data: result.statistics,
    });
  } catch (error) {
    console.error("Get analysis statistics error:", error);
    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "Failed to retrieve analysis statistics",
    });
  }
});

// @route   GET /api/v1/analysis/:analysisId/export
// @desc    Export analysis report
// @access  Private
router.get("/:analysisId/export", authMiddleware, async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { format = "json" } = req.query;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await analysisService.getAnalysis(analysisId, userId, orgId);
    const analysis = result.analysis;

    // Log export activity
    await AuditLog.create({
      actorId: userId,
      orgId: orgId,
      action: "analysis_exported",
      target: {
        type: "analysis",
        id: analysisId,
        format: format,
      },
    });

    // Record API usage
    await Metering.create({
      orgId: orgId,
      userId: userId,
      type: "export",
      count: 1,
      period: new Date().toISOString().slice(0, 7),
    });

    if (format === "pdf") {
      // TODO: Implement PDF export
      res.status(501).json({
        type: "not_implemented",
        title: "Not Implemented",
        detail: "PDF export not yet implemented",
      });
    } else {
      // JSON export
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="analysis-${analysisId}.json"`
      );
      res.json({
        analysis: analysis,
        exportedAt: new Date().toISOString(),
        exportedBy: userId,
      });
    }
  } catch (error) {
    console.error("Export analysis error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        type: "analysis_not_found",
        title: "Analysis Not Found",
        detail: error.message,
        instance: "/api/v1/analysis/:analysisId/export",
      });
    }

    res.status(500).json({
      type: "internal_error",
      title: "Internal Server Error",
      detail: "Failed to export analysis",
    });
  }
});

module.exports = router;
