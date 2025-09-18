const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware, requireRole } = require("../middleware/auth");
const walkthroughService = require("../services/walkthroughService");

const router = express.Router();

// @route   POST /api/v1/walkthrough/generate/:analysisId
// @desc    Generate walkthrough steps for an analysis
// @access  Private (Garage users only)
router.post(
  "/generate/:analysisId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  async (req, res) => {
    try {
      const { analysisId } = req.params;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await walkthroughService.generateWalkthrough(
        analysisId,
        userId,
        orgId
      );

      res.status(200).json({
        type: "walkthrough_generated",
        title: "Walkthrough Generated Successfully",
        detail: result.message,
        data: result.walkthrough,
      });
    } catch (error) {
      console.error("Error generating walkthrough:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   GET /api/v1/walkthrough/:analysisId
// @desc    Get walkthrough for an analysis
// @access  Private
router.get("/:analysisId", authMiddleware, async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user._id;
    const orgId = req.user.orgId;

    const result = await walkthroughService.getWalkthrough(
      analysisId,
      userId,
      orgId
    );

    res.status(200).json({
      type: "walkthrough_retrieved",
      title: "Walkthrough Retrieved Successfully",
      data: result.walkthrough,
    });
  } catch (error) {
    console.error("Error retrieving walkthrough:", error);
    res.status(404).json({
      type: "walkthrough_not_found",
      title: "Walkthrough Not Found",
      detail: error.message,
    });
  }
});

// @route   PUT /api/v1/walkthrough/:walkthroughId
// @desc    Update walkthrough steps
// @access  Private (Garage users only)
router.put(
  "/:walkthroughId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  [
    body("steps")
      .isArray({ min: 1 })
      .withMessage("Steps must be a non-empty array"),
    body("steps.*.title")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Step title is required"),
    body("steps.*.detail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Step detail is required"),
    body("steps.*.type")
      .isIn(["check", "replace", "retest"])
      .withMessage("Step type must be check, replace, or retest"),
    body("steps.*.order")
      .isInt({ min: 1 })
      .withMessage("Step order must be a positive integer"),
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
      const { walkthroughId } = req.params;
      const { steps } = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await walkthroughService.updateWalkthrough(
        walkthroughId,
        steps,
        userId,
        orgId
      );

      res.status(200).json({
        type: "walkthrough_updated",
        title: "Walkthrough Updated Successfully",
        detail: result.message,
        data: result.walkthrough,
      });
    } catch (error) {
      console.error("Error updating walkthrough:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   POST /api/v1/walkthrough/:walkthroughId/steps
// @desc    Add new step to walkthrough
// @access  Private (Garage users only)
router.post(
  "/:walkthroughId/steps",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  [
    body("title")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Step title is required"),
    body("detail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Step detail is required"),
    body("type")
      .isIn(["check", "replace", "retest"])
      .withMessage("Step type must be check, replace, or retest"),
    body("estMinutes")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Estimated minutes must be a non-negative integer"),
    body("order")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Step order must be a positive integer"),
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
      const { walkthroughId } = req.params;
      const step = req.body;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await walkthroughService.addStep(
        walkthroughId,
        step,
        userId,
        orgId
      );

      res.status(201).json({
        type: "step_added",
        title: "Step Added Successfully",
        detail: result.message,
        data: result.walkthrough,
      });
    } catch (error) {
      console.error("Error adding step:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   DELETE /api/v1/walkthrough/:walkthroughId
// @desc    Delete walkthrough
// @access  Private (Garage users only)
router.delete(
  "/:walkthroughId",
  authMiddleware,
  requireRole(["garage_user", "garage_admin"]),
  async (req, res) => {
    try {
      const { walkthroughId } = req.params;
      const userId = req.user._id;
      const orgId = req.user.orgId;

      const result = await walkthroughService.deleteWalkthrough(
        walkthroughId,
        userId,
        orgId
      );

      res.status(200).json({
        type: "walkthrough_deleted",
        title: "Walkthrough Deleted Successfully",
        detail: result.message,
      });
    } catch (error) {
      console.error("Error deleting walkthrough:", error);
      res.status(500).json({
        type: "internal_server_error",
        title: "Internal Server Error",
        detail: error.message,
      });
    }
  }
);

// @route   GET /api/v1/walkthrough/:walkthroughId/export
// @desc    Export walkthrough as PDF (placeholder)
// @access  Private
router.get("/:walkthroughId/export", authMiddleware, async (req, res) => {
  try {
    // TODO: Implement PDF export functionality
    res.status(501).json({
      type: "not_implemented",
      title: "PDF Export Not Implemented",
      detail: "PDF export functionality will be implemented in a future release",
    });
  } catch (error) {
    console.error("Error exporting walkthrough:", error);
    res.status(500).json({
      type: "internal_server_error",
      title: "Internal Server Error",
      detail: error.message,
    });
  }
});

module.exports = router;
