const mongoose = require("mongoose");

const errorCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Engine",
        "Transmission",
        "Electrical",
        "Suspension",
        "Brakes",
        "Exhaust",
        "Cooling",
        "Emissions",
        "Body",
        "Other",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    commonCauses: [
      {
        type: String,
        trim: true,
      },
    ],
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    estimatedRepairTime: {
      type: String,
      trim: true,
    },
    estimatedCostKes: {
      type: Number,
      min: 0,
    },
    laborHours: {
      type: Number,
      min: 0,
    },
    partsRequired: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        estimatedCost: {
          type: Number,
          min: 0,
        },
        partNumber: {
          type: String,
          trim: true,
        },
        isOEM: {
          type: Boolean,
          default: false,
        },
      },
    ],
    vagModels: [
      {
        make: {
          type: String,
          enum: ["Volkswagen", "Audi", "Porsche", "Skoda", "Seat", "Fiat"],
          required: true,
        },
        models: [
          {
            type: String,
            trim: true,
          },
        ],
        years: {
          start: {
            type: Number,
            min: 1990,
          },
          end: {
            type: Number,
            max: new Date().getFullYear() + 1,
          },
        },
      },
    ],
    technicalDetails: {
      ecuModule: {
        type: String,
        trim: true,
      },
      dataBus: {
        type: String,
        trim: true,
      },
      freezeFrameData: {
        type: Boolean,
        default: false,
      },
    },
    aiExplanation: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
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

// Index for efficient queries
errorCodeSchema.index({ code: 1 });
errorCodeSchema.index({ category: 1, severity: 1 });
errorCodeSchema.index({ "vagModels.make": 1 });
errorCodeSchema.index({ estimatedCostKes: 1 });

// Virtual for total parts cost
errorCodeSchema.virtual("totalPartsCost").get(function () {
  return this.partsRequired.reduce(
    (total, part) => total + part.estimatedCost,
    0
  );
});

// Virtual for total estimated cost including labor
errorCodeSchema.virtual("totalEstimatedCost").get(function () {
  const laborCost = (this.laborHours || 0) * 3500; // 3500 KES per hour
  return this.estimatedCostKes + laborCost;
});

// Ensure virtuals are included in JSON output
errorCodeSchema.set("toJSON", { virtuals: true });
errorCodeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("ErrorCode", errorCodeSchema);
