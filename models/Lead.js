import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ADD THIS
    phone: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    language: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    otpLastSent: { type: Date },

    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);