import express from "express";
import { generateOTP, submitOTP } from "../controllers/otp.js";
// import authMiddleware from "../middleware/Authmiddleware.js";

const OTPRoutes=express.Router()

OTPRoutes.post('/generate',generateOTP)
OTPRoutes.post('/submit',submitOTP)

export default OTPRoutes