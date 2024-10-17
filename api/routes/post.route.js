import express from "express";
import { getposts, searchposts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/getposts",getposts)
router.get("/searchposts",searchposts)

export default router;
