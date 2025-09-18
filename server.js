const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require("./routes/auth");
const quotationRoutes = require("./routes/quotations");
const errorCodeRoutes = require("./routes/errorCodes");
const uploadRoutes = require("./routes/upload");
const analysisRoutes = require("./routes/analysis");
const walkthroughRoutes = require("./routes/walkthrough");

// Import middleware
const { errorHandler } = require("./middleware/errorHandler");
const { authMiddleware } = require("./middleware/auth");

// Import services
const openaiService = require("./services/openaiService");
const minioService = require("./services/minioService");
const redisService = require("./services/redisService");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dequote_vag", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Manual CORS headers middleware - must come before helmet
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://frontend:80",
    "http://frontend:3001",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Security middleware with less restrictive CORS settings
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes - VAGnosis v1 API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quotations", authMiddleware, quotationRoutes);
app.use("/api/v1/error-codes", errorCodeRoutes);
app.use("/api/v1/upload", authMiddleware, uploadRoutes);
app.use("/api/v1/analysis", authMiddleware, analysisRoutes);
app.use("/api/v1/walkthrough", authMiddleware, walkthroughRoutes);

// Legacy API routes (for backward compatibility)
app.use("/api/auth", authRoutes);
app.use("/api/quotations", authMiddleware, quotationRoutes);
app.use("/api/error-codes", errorCodeRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "VAGnosis SaaS API - Automotive Diagnostic Platform",
    version: "1.0.0",
    description:
      "Multi-tenant SaaS platform for VAG vehicle diagnostics with AI-powered analysis",
    endpoints: {
      v1: {
        auth: "/api/v1/auth",
        quotations: "/api/v1/quotations",
        errorCodes: "/api/v1/error-codes",
        upload: "/api/v1/upload",
        analysis: "/api/v1/analysis",
        walkthrough: "/api/v1/walkthrough",
      },
      legacy: {
        auth: "/api/auth",
        quotations: "/api/quotations",
        errorCodes: "/api/error-codes",
        upload: "/api/upload",
      },
    },
    features: [
      "Multi-tenant organization support",
      "RBAC with 6 user roles",
      "Multi-currency support (KES, UGX, TZS, USD)",
      "S3-compatible file storage",
      "AI-powered DTC analysis",
      "Real-time caching with Redis",
      "Comprehensive audit logging",
    ],
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
