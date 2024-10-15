import bcrypt from "bcrypt";
import { dbconnection } from "../config/dbconnect.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, statusCode: 400, message: "All fields are required." });
  }

  try {
    const checkQuery = "SELECT * FROM users WHERE user_email = ?";
    const [rows] = await dbconnection.promise().query(checkQuery, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, statusCode: 400, message: "Wrong email or password." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, statusCode: 400, message: "Wrong email or password." });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json({ success: true, statusCode: 200, message: "Logged in successfully." });

  } catch (error) {
    return res.status(500).json({ success: false, statusCode: 500, message: "Server error." });
  }
};
