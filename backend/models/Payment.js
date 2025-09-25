const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    type: {
      type: String,
      enum: ["subscription", "api_call", "overage", "one_time"],
      required: true,
    },
    amount: {
      value: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        enum: ["KES", "UGX", "TZS", "USD"],
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "mobile_money", "stripe"],
      required: true,
    },
    stripe: {
      paymentIntentId: {
        type: String,
        trim: true,
      },
      chargeId: {
        type: String,
        trim: true,
      },
      customerId: {
        type: String,
        trim: true,
      },
    },
    metadata: {
      apiCalls: {
        type: Number,
        default: 0,
      },
      analysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Analysis",
      },
      quotationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quotation",
      },
      walkthroughId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Walkthrough",
      },
    },
    processedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentSchema.index({ userId: 1 });
paymentSchema.index({ orgId: 1 });
paymentSchema.index({ subscriptionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ "stripe.paymentIntentId": 1 });
paymentSchema.index({ type: 1, createdAt: -1 });

// Pre-save middleware to set processedAt when status changes to completed
paymentSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.processedAt
  ) {
    this.processedAt = new Date();
  }
  if (
    this.isModified("status") &&
    this.status === "refunded" &&
    !this.refundedAt
  ) {
    this.refundedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
