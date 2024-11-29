import express from "express";
import { getfeedbacks, getPostRating, ratePost, sendfeedback } from "../controllers/rates.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";


const router = express.Router();

router.get("/rate/getrating",getPostRating);
router.get("/rate/getfeedbacks",verifyToken,getfeedbacks);
router.post("/rate/sendrate",ratePost);
router.post("/rate/sendfeedback",sendfeedback)

export default router;
