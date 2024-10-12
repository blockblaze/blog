import express from "express";
import { sendContact } from "../controllers/contacts.controller.js";



const router = express.Router();

router.get("/sendContact",sendContact)

export default router;