import express from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/auth.controller.js";

const rateLimiter = rateLimit({
windowMs:  10 * 60 * 1000, // 10 minutes
max: 5, // Limit each IP to 3 requests per windowMs
message: "Too many requests from this IP, please try again later.",
});



const router = express.Router();

router.post("/login",rateLimiter,login)

export default router;