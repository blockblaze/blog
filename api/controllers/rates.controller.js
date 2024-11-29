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
      // const ratedPostsCookie = req.cookies.ratedPosts || '[]'; // Get cookie or set an empty array
      // const ratedPosts = JSON.parse(ratedPostsCookie); // Parse the cookie value into an array
      
      if (checkResult.length > 0) {
        // ratedPosts.push(req.body.postId);
        // res.cookie('ratedPosts', JSON.stringify(ratedPosts), {
        //   maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        //   httpOnly: false, // Allow client-side access
        //   secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
        //   sameSite: 'Strict',
        // });
        
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
  
    // //Store postId in the cookie
    // ratedPosts.push(req.body.postId);
    // res.cookie('ratedPosts', JSON.stringify(ratedPosts), {
    //   maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    //   httpOnly: false, // Allow client-side access
    //   secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
    //   sameSite: 'Strict',
    // });

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
  
export const getfeedbacks = async (req , res)=>{
 const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 9;
  
  try {
  if(req.query.format == 'count'){
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // last day of the last month

    let countQuery = `SELECT COUNT(feedback_id) AS totalFeedBacks FROM feedbacks`
    let lastMonthCountQuery = `SELECT COUNT(*) AS lastMonthFeedbacks FROM feedbacks WHERE submission_date BETWEEN ? AND ?`
    const [count] = await dbconnection.promise().query(countQuery);
    const [lastMonthCount] = await dbconnection.promise().query(lastMonthCountQuery,[lastMonthStart,lastMonthEnd]);

    const data ={
      totalFeedbacks:count[0].totalFeedBacks,
      lastMonthCount:lastMonthCount[0].lastMonthFeedbacks
    }
    res.status(200).json({"success":true,"data":data});
  }else{
  // Step 1: Query to get contacts
  let feedbackQuery = `
  SELECT f.feedback_id AS feedbackId,
    f.feedback,
    f.user_ip AS userIp,
    f.submission_date AS submissionDate,
    p.title,
    p.slug
      FROM feedbacks f 
        LEFT JOIN posts p ON f.related_post = p.post_id`;
  
  let params = [];
  
  // Validate the order value and prevent SQL injection
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  feedbackQuery += ` ORDER BY submission_date ${order}`;
  
  // Add limit and offset
  feedbackQuery += ` LIMIT ? OFFSET ?`;
  params = [...params, limit, offset];
  
  
  const [posts] = await dbconnection.promise().query(feedbackQuery, params);


  
  if (posts.length === 0) {
    return res.status(200).json([]); // No posts found
  }
  
  return res.status(200).json(posts);
    }
  

  } catch (err) {
  console.error(err);
  res.status(500).json({
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
      let feedback = sanitizedFeedback; 
  
      // Store feedback in the database
      const query = "INSERT INTO feedbacks (feedback, user_ip,related_post) VALUES (?,?,?)";
      const [result] = await dbconnection.promise().query(query, [feedback, ip,req.body.postId || null]);
  
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

export const deletefeedback = async (req,res)=>{
  const feedbackId = req.params.feedbackId;

  if(!feedbackId) return res.status(400).json({
    success: false,
    statusCode: 400,
    message: "Feedback id is required.",
  });

  try{
    // Delete from posts table
    const deleteFeedbackQuery = "DELETE FROM feedbacks WHERE feedback_id = ?";
    const [deleteFeedbackResult] = await dbconnection.promise().execute(deleteFeedbackQuery, [feedbackId]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Feedback has been deleted successfully.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    });
  }
};