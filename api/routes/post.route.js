import express from "express";
import { createPost, deletePost, getposts , getstats, updatePost , updatePostActivity } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";

const router = express.Router();

router.get("/getposts",getposts);
router.get("/stats",verifyToken,getstats);
router.post("/create",verifyToken,createPost);
router.post("/update",verifyToken,updatePost);
router.post("/updatepostactivity",updatePostActivity);
router.delete("/deletepost/:postId",verifyToken,deletePost)

export default router;
