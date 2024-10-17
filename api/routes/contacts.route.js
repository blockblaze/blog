import express from "express";
import rateLimit from "express-rate-limit";
import { registEmail } from "../controllers/regist.controller.js";

const rateLimiter = rateLimit({
windowMs: 6 * 60 * 60 * 1000, // 6 hours
max: 3, // Limit each IP to 1 request per windowMs
message: "Too many requests from this IP, please try again after 6 hours.",
});



const router = express.Router();

router.post("/sendContact",rateLimiter,registEmail)

export default router;