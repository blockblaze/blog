import express from "express";
import { createPost, getposts, searchposts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";

const router = express.Router();

router.get("/getposts",getposts)
router.get("/searchposts",searchposts)
router.post("/create",verifyToken,createPost)

export default router;
