import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// Create a transporter object using SMTP transport
export const transporter  = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS,
  },
});

