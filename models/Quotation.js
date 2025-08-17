const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleInfo: {
      make: {
        type: String,
        required: true,
        enum: ["Volkswagen", "Audi", "Porsche", "Skoda", "Seat", "Fiat"],
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: Number,
        required: true,
        min: 1990,
        max: new Date().getFullYear() + 1,
      },
      vin: {
        type: String,
        trim: true,
        uppercase: true,
      },
      mileage: {
        type: Number,
        min: 0,
      },
      engineType: {
        type: String,
        trim: true,
      },
    },
    vcdsReport: {
      filename: {
        type: String,
        required: false,
      },
      originalName: {
        type: String,
        required: false,
      },
      filePath: {
        type: String,
        required: false,
      },
      fileSize: {
        type: Number,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    errorCodes: [
      {
        code: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
        },
        description: {
          type: String,
          required: true,
        },
        severity: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
          default: "medium",
        },
        aiExplanation: {
          type: String,
        },
        estimatedRepairTime: {
          type: String,
        },
        estimatedCost: {
          type: Number,
          min: 0,
        },
        parts: [
          {
            name: {
              type: String,
              required: true,
            },
            cost: {
              type: Number,
              required: true,
              min: 0,
            },
            quantity: {
              type: Number,
              default: 1,
              min: 1,
            },
          },
        ],
        laborHours: {
          type: Number,
          min: 0,
        },
      },
    ],
    totalEstimate: {
      partsCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      laborCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "KES",
      },
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "completed"],
      default: "draft",
    },
    notes: {
      type: String,
      trim: true,
    },
    validUntil: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      },
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

// Calculate total estimate before saving
quotationSchema.pre("save", function (next) {
  let totalPartsCost = 0;
  let totalLaborCost = 0;

  this.errorCodes.forEach((error) => {
    // Calculate parts cost
    error.parts.forEach((part) => {
      totalPartsCost += part.cost * part.quantity;
    });

    // Calculate labor cost (assuming 3500 KES per hour)
    const laborRate = 3500;
    totalLaborCost += (error.laborHours || 0) * laborRate;
  });

  this.totalEstimate.partsCost = totalPartsCost;
  this.totalEstimate.laborCost = totalLaborCost;
  this.totalEstimate.totalCost = totalPartsCost + totalLaborCost;

  next();
});

// Index for efficient queries
quotationSchema.index({ user: 1, createdAt: -1 });
quotationSchema.index({ "vehicleInfo.make": 1, "vehicleInfo.model": 1 });
quotationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Quotation", quotationSchema);
