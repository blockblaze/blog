import express from "express";
import { getPostRating, ratePost } from "../controllers/rates.controller.js";


const router = express.Router();

router.get("/rate/getrating",getPostRating);
router.post("/rate/sendrate",ratePost);

export default router;
