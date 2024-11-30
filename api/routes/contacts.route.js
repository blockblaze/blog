import express from "express";
import rateLimit from "express-rate-limit";
import { deleteContact, getContacts, respondContact, sendContact } from "../controllers/contacts.controller.js";
import { verifyToken } from "../utils/verfiyToken.js";

const rateLimiter = rateLimit({
windowMs: 6 * 60 * 60 * 1000, // 6 hours
max: 3, // Limit each IP to 1 request per windowMs
message: "Too many requests from this IP, please try again after 6 hours.",
});



const router = express.Router();

router.get("/getcontacts",verifyToken,getContacts)
router.post("/sendcontact",rateLimiter,sendContact)
router.post("/respond",verifyToken,respondContact)
router.delete("/deletecontact/:contactId",verifyToken,deleteContact)


export default router;