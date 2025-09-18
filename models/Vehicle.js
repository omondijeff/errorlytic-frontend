const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null, // null for individuals
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    plate: {
      type: String,
      trim: true,
      uppercase: true,
    },
    make: {
      type: String,
      enum: ["VW", "Audi", "Skoda", "Seat", "Porsche", "Other"],
      required: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1990,
      max: new Date().getFullYear() + 1,
    },
    engineType: {
      type: String,
      trim: true,
    },
    mileage: {
      type: Number,
      min: 0,
    },
    color: {
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
vehicleSchema.index({ vin: 1 });
vehicleSchema.index({ plate: 1 });
vehicleSchema.index({ orgId: 1 });
vehicleSchema.index({ ownerUserId: 1 });
vehicleSchema.index({ make: 1, model: 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
