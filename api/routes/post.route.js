import express from "express";
import { createPost, deletePost, getposts , updatePost , updatePostActivity } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";

const router = express.Router();

router.get("/getposts",getposts);
router.post("/create",verifyToken,createPost);
router.post("/update",verifyToken,updatePost);
router.post("/updatepostactivity",updatePostActivity);
router.delete("/deletepost/:postId",verifyToken,deletePost)

export default router;
