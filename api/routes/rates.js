import express from "express";
import { getPostRating, ratePost, sendfeedback } from "../controllers/rates.controller.js";


const router = express.Router();

router.get("/rate/getrating",getPostRating);
router.post("/rate/sendrate",ratePost);
router.post("/rate/sendfeedback",sendfeedback)

export default router;
