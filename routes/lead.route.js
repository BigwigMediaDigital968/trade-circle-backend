import express from "express";
import {
  registerLead,
  verifyPhoneOtp,
  resendOtp,
  getAllLeads
} from "../controllers/lead.controller.js";

const router = express.Router();

router.post("/register", registerLead);
router.post("/resend-otp", resendOtp);
router.post("/verify-phone-otp", verifyPhoneOtp);
router.get("/get", getAllLeads);

export default router;