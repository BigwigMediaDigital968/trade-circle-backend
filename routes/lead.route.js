import express from "express";
import {
  registerLead,
  verifyPhoneOtp,
  resendOtp,
  getAllLeads,
  updateLeadAccountStatus,
  deleteLead
} from "../controllers/lead.controller.js";

const router = express.Router();

router.post("/register", registerLead);
router.post("/resend-otp", resendOtp);
router.post("/verify-phone-otp", verifyPhoneOtp);
router.get("/get", getAllLeads);
router.put("/update-status/:id", updateLeadAccountStatus);
router.delete("/delete/:id", deleteLead);

export default router;