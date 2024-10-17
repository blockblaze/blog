import express from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";

const rateLimiter = rateLimit({
windowMs:  10 * 60 * 1000, // 10 minutes
max: 5, // Limit each IP to 3 requests per windowMs
message: "Too many requests from this IP, please try again after 10 minutes.",
});



const router = express.Router();

router.post("/login",rateLimiter,login)
router.get("/dashboard",verifyToken,(req,res)=>{
    res.json({ success: true, message: "Welcome to the dashboard", user: req.user });
})

export default router;