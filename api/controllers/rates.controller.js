import validator from "validator";
import moment from 'moment';

import { dbconnection } from "../config/dbconnect.js";
import fetch from "node-fetch";

export const getPostRating = async (req,res)=>{
    if(!req.query.postId) return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Post id is required.",
        });
try{

    const [result] = await dbconnection.promise().query('SELECT COUNT(*) AS ratingCount, AVG(rate) AS avgRates FROM rates WHERE post_id = ?', [req.query.postId]);

    const avgRating = parseFloat(result[0].avgRates).toFixed(1) || 0;
    res.status(200).json({
        "rating":avgRating,
        "voteCount":result[0].ratingCount
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
    if (!req.body.rating || !req.body.postId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All fields are required.",
      });
    }
  
    // Ensure 'rate' is a number
    if (typeof req.body.rating !== "number") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Rate must be a number.",  // Corrected the message
      });
    }
  
    // Check if rate is between 1 and 5
    if (req.body.rating > 5 || req.body.rating < 1) {
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
      const ratedPostsCookie = req.cookies.ratedPosts || '[]'; // Get cookie or set an empty array
      const ratedPosts = JSON.parse(ratedPostsCookie); // Parse the cookie value into an array
      
      if (checkResult.length > 0) {
        ratedPosts.push(req.body.postId);
        res.cookie('ratedPosts', JSON.stringify(ratedPosts), {
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
          httpOnly: false, // Allow client-side access
          secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
          sameSite: 'Strict',
        });
        
        return res.status(409).json({
          success: false,
          statusCode: 409, // Conflict is more appropriate here
          message: "You have already rated this post.",
        });
      }
  
      // Insert the user's rating into the database
      const rateQuery = "INSERT INTO rates (rate, user_ip, post_id) VALUES (?, ?, ?)";
      const rateParams = [req.body.rating, ip, req.body.postId];
      const [rateResult] = await dbconnection.promise().execute(rateQuery, rateParams);
  
    //Store postId in the cookie
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
  

  export const sendfeedback = async (req, res) => {
    if (!req.body.feedback) return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Feedback is required.",
    });
  
    try {
      // Properly sanitize feedback input
      let sanitizedFeedback = validator.trim(req.body.feedback);
      sanitizedFeedback = validator.escape(sanitizedFeedback);
      sanitizedFeedback = validator.stripLow(sanitizedFeedback, false); // false to keep standard characters
  
      // Fetch user's IP
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;
  
      // Construct feedback message
      let feedback = ''; // Use let instead of const to allow modifications
      if (req.body.postId) feedback += `<h2>This feedback is related to the post id ${req.body.postId}</h2>`;
      feedback += `<h2>User ip: ${ip}</h2><h2>Send date: ${moment().format("YYYY-MM-DD HH:mm:ss")}</h2> <p>${sanitizedFeedback}</p>`;
  
      // Store feedback in the database
      const query = "INSERT INTO feedbacks (feedback, user_ip) VALUES (?, ?)";
      const [result] = await dbconnection.promise().query(query, [feedback, ip]);
  
      // Respond to the client
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Your feedback has been sent successfully.",
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error.",
      });
    }
  };