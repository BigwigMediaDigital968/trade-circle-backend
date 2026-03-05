import Lead from "../models/Lead.js";
import bcrypt from "bcryptjs";
import { sendSmsOtp } from "../services/otp.service.js";
import { verifySmsOtp } from "../services/otp.service.js";

// Register new lead
export const registerLead = async (req, res) => {
  try {
    const { fullName, email, phone, countryCode, language, password } =
      req.body;

    const existingLead = await Lead.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingLead) {
      return res.status(400).json({
        message: "Email or phone already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fullPhone = `${countryCode}${phone}`;

    await Lead.create({
      fullName,
      email,
      phone,
      countryCode,
      language,
      password: hashedPassword,
    });

    const otpResponse = await sendSmsOtp(fullPhone);

    if (otpResponse.result !== "success") {
      return res.status(400).json({
        message: "Failed to send OTP",
      });
    }

    res.status(201).json({
      message: "Lead registered. OTP sent to mobile.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify phone OTP
export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, countryCode, otp } = req.body;

    const fullPhone = `${countryCode}${phone}`;

    const lead = await Lead.findOne({ phone });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const verifyResponse = await verifySmsOtp(fullPhone, otp);

    if (verifyResponse.statusCode !== "000") {
      return res.status(400).json({
        message: verifyResponse.reason || "Invalid OTP",
      });
    }

    lead.isPhoneVerified = true;
    lead.status = "verified";

    await lead.save();

    res.json({ message: "Phone verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { phone, countryCode } = req.body;

    const fullPhone = `${countryCode}${phone}`;

    const lead = await Lead.findOne({ phone });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      lead.otpLastSent &&
      Date.now() - lead.otpLastSent.getTime() < 60 * 1000
    ) {
      return res.status(400).json({
        message: "Please wait before requesting another OTP",
      });
    }

    const otpResponse = await sendSmsOtp(fullPhone);

    if (otpResponse.result !== "success") {
      return res.status(400).json({
        message: "Failed to resend OTP",
      });
    }

    lead.otpLastSent = new Date();
    await lead.save();

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leads (for admin)
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .select("-password -otp -otpExpiry") // hide sensitive fields
      .sort({ createdAt: -1 });

    res.json({
      total: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};