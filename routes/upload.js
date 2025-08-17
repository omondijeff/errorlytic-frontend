const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { body, validationResult } = require("express-validator");
const Quotation = require("../models/Quotation");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || "./uploads";

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `vcds-${uniqueSuffix}${ext}`);
  },
});

// File filter for VCDS reports
const fileFilter = (req, file, cb) => {
  // Allow common VCDS report formats
  const allowedMimeTypes = [
    "text/plain", // .txt files
    "text/csv", // .csv files
    "application/pdf", // .pdf files
    "application/vnd.ms-excel", // .xls files
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx files
    "application/json", // .json files
  ];

  const allowedExtensions = [".txt", ".csv", ".pdf", ".xls", ".xlsx", ".json"];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExt)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only VCDS report formats are allowed."),
      false
    );
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1,
  },
});

// @route   POST /api/upload/vcds-report
// @desc    Upload VCDS report for a quotation
// @access  Private
router.post(
  "/vcds-report",
  [
    body("quotationId")
      .isMongoId()
      .withMessage("Valid quotation ID is required"),
    upload.single("vcdsReport"),
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const { quotationId } = req.body;

      // Verify quotation exists and belongs to user
      const quotation = await Quotation.findOne({
        _id: quotationId,
        user: req.user._id,
        isActive: true,
      });

      if (!quotation) {
        // Delete uploaded file if quotation not found
        await fs.unlink(req.file.path);

        return res.status(404).json({
          success: false,
          error: "Quotation not found",
        });
      }

      // Check if quotation already has a VCDS report
      if (quotation.vcdsReport) {
        // Delete old file
        try {
          await fs.unlink(quotation.vcdsReport.filePath);
        } catch (error) {
          console.warn("Could not delete old VCDS report file:", error);
        }
      }

      // Update quotation with new VCDS report
      quotation.vcdsReport = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        uploadDate: new Date(),
      };

      // Reset status to draft when new report is uploaded
      quotation.status = "draft";

      // Clear previous error codes
      quotation.errorCodes = [];

      await quotation.save();

      res.json({
        success: true,
        message: "VCDS report uploaded successfully",
        data: {
          vcdsReport: quotation.vcdsReport,
          quotationId: quotation._id,
        },
      });
    } catch (error) {
      console.error("VCDS report upload error:", error);

      // Clean up uploaded file on error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.warn("Could not delete uploaded file on error:", unlinkError);
        }
      }

      res.status(500).json({
        success: false,
        error: "Internal server error while uploading VCDS report",
      });
    }
  }
);

// @route   DELETE /api/upload/vcds-report/:quotationId
// @desc    Remove VCDS report from a quotation
// @access  Private
router.delete("/vcds-report/:quotationId", async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Verify quotation exists and belongs to user
    const quotation = await Quotation.findOne({
      _id: quotationId,
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
        error: "No VCDS report found for this quotation",
      });
    }

    // Only allow removal if quotation is in draft status
    if (quotation.status !== "draft") {
      return res.status(400).json({
        success: false,
        error:
          "Cannot remove VCDS report from quotation that is not in draft status",
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(quotation.vcdsReport.filePath);
    } catch (error) {
      console.warn("Could not delete VCDS report file:", error);
    }

    // Remove VCDS report from quotation
    quotation.vcdsReport = undefined;
    quotation.errorCodes = [];
    quotation.status = "draft";

    await quotation.save();

    res.json({
      success: true,
      message: "VCDS report removed successfully",
    });
  } catch (error) {
    console.error("VCDS report removal error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while removing VCDS report",
    });
  }
});

// @route   GET /api/upload/vcds-report/:quotationId
// @desc    Get VCDS report information for a quotation
// @access  Private
router.get("/vcds-report/:quotationId", async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Verify quotation exists and belongs to user
    const quotation = await Quotation.findOne({
      _id: quotationId,
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
      return res.status(404).json({
        success: false,
        error: "No VCDS report found for this quotation",
      });
    }

    res.json({
      success: true,
      data: {
        vcdsReport: quotation.vcdsReport,
      },
    });
  } catch (error) {
    console.error("VCDS report fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching VCDS report",
    });
  }
});

// @route   GET /api/upload/vcds-report/:quotationId/download
// @desc    Download VCDS report file
// @access  Private
router.get("/vcds-report/:quotationId/download", async (req, res) => {
  try {
    const { quotationId } = req.params;

    // Verify quotation exists and belongs to user
    const quotation = await Quotation.findOne({
      _id: quotationId,
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
      return res.status(404).json({
        success: false,
        error: "No VCDS report found for this quotation",
      });
    }

    // Check if file exists
    try {
      await fs.access(quotation.vcdsReport.filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: "VCDS report file not found on server",
      });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${quotation.vcdsReport.originalName}"`
    );

    // Send file
    res.sendFile(path.resolve(quotation.vcdsReport.filePath));
  } catch (error) {
    console.error("VCDS report download error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while downloading VCDS report",
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 10MB.",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field. Use "vcdsReport" as the field name.',
      });
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
});

module.exports = router;
