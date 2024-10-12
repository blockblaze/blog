import express from "express";
import { sendContact } from "../controllers/contacts.controller.js";
import rateLimit from "express-rate-limit";

const contactRateLimiter = rateLimit({
windowMs: 6 * 60 * 60 * 1000, // 6 hours
max: 3, // Limit each IP to 1 request per windowMs
message: "Too many requests from this IP, please try again later.",
});



const router = express.Router();

router.post("/sendContact",contactRateLimiter,sendContact)

export default router;