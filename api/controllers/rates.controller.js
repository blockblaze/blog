import { dbconnection } from "../config/dbconnect.js";
import fetch from "node-fetch";

export const getPostRating = async (req,res)=>{
    if(!req.query.postId) return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Post id is required.",
        });
try{

    const [result] = await dbconnection.promise().query('SELECT AVG(rate) AS avgRates FROM rates WHERE post_id = ?', [req.query.postId]);

    const avgRating = parseFloat(result[0].avgRates).toFixed(1) || 0;
    res.status(200).json({
        "rating":avgRating
    });


}catch(err){
    console.log(err)
return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error.",
    });


}
};

export const ratePost = async (req, res) => {
    // Check if required fields are provided
    if (!req.body.rate || !req.body.postId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All fields are required.",
      });
    }
  
    // Ensure 'rate' is a number
    if (typeof req.body.rate !== "number") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Rate must be a number.",  // Corrected the message
      });
    }
  
    // Check if rate is between 1 and 5
    if (req.body.rate > 5 || req.body.rate < 1) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Rate must be between 1 and 5.",
      });
    }
  
    try {
      // Fetch the user's public IP
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;
  
      // Check if the user has rated this specific post before
      const checkQuery = "SELECT * FROM rates WHERE user_ip = ? AND post_id = ?";
      const [checkResult] = await dbconnection.promise().execute(checkQuery, [ip, req.body.postId]);
  
      // If the user has already rated this post, return an error
      if (checkResult.length > 0) {
        return res.status(409).json({
          success: false,
          statusCode: 409, // Conflict is more appropriate here
          message: "You have already rated this post.",
        });
      }
  
      // Insert the user's rating into the database
      const rateQuery = "INSERT INTO rates (rate, user_ip, post_id) VALUES (?, ?, ?)";
      const rateParams = [req.body.rate, ip, req.body.postId];
      const [rateResult] = await dbconnection.promise().execute(rateQuery, rateParams);
  
    //Store postId in the cookie
    const ratedPostsCookie = req.cookies.ratedPosts || '[]'; // Get cookie or set an empty array
    const ratedPosts = JSON.parse(ratedPostsCookie); // Parse the cookie value into an array
    
    ratedPosts.push(req.body.postId);
    res.cookie('ratedPosts', JSON.stringify(ratedPosts), {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
      sameSite: 'Strict',
    });

      // Respond with success
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Thanks for rating this post.",
      });
  
    } catch (err) {
      // Handle errors
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error.",
      });
    }
  };
  