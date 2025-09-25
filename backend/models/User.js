const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null, // null for individuals
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "individual",
        "garage_user",
        "garage_admin",
        "insurer_user",
        "insurer_admin",
        "superadmin",
      ],
      default: "individual",
    },
    profile: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    plan: {
      tier: {
        type: String,
        enum: ["starter", "pro", "enterprise"],
        default: "starter",
      },
      renewsAt: {
        type: Date,
        default: function () {
          return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        },
      },
      status: {
        type: String,
        enum: ["active", "past_due", "canceled"],
        default: "active",
      },
    },
    quotas: {
      apiCalls: {
        used: {
          type: Number,
          default: 0,
        },
        limit: {
          type: Number,
          default: 100, // starter plan limit
        },
        periodStart: {
          type: Date,
          default: Date.now,
        },
        periodEnd: {
          type: Date,
          default: function () {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
          },
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if passwordHash is modified and it's not already hashed
  if (!this.isModified("passwordHash")) return next();

  // Check if passwordHash is already hashed (starts with $2)
  if (this.passwordHash && this.passwordHash.startsWith("$2")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

// Indexes for efficient queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ orgId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "plan.tier": 1, "plan.status": 1 });

module.exports = mongoose.model("User", userSchema);
