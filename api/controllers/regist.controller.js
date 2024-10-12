import validator from "validator";
import { dbconnection } from "../config/dbconnect.js";
import gen from "@codedipper/random-code";

export const registEmail = (req, res) => {
  let { email, name, isConsent } = req.body;

  // Check if required fields are present
  if (!email || typeof isConsent !== "boolean") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Email and consent are required.",
    });
  }

  // If name is not provided, set it to null
  if (!name) {
    name = null;
  } else {
    // Validate name (letters and spaces only)
    if (typeof name !== "string" || name.trim().length === 0 || !/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid name. Name can only contain letters and spaces.",
      });
    }
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid email address.",
    });
  }

  const checkQuery = "SELECT email_id AS emailId FROM `emails` WHERE email = ?";
  dbconnection.query(checkQuery, [email], (err, checkResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Error checking existing email.",
      });
    }

    // If email exists, update consent or name
    if (checkResult.length > 0) {
      const updateQuery = "UPDATE emails SET name = ?, is_consent = ? WHERE email_id = ?";
      const updateValues = [name, isConsent, checkResult[0].emailId];
      dbconnection.query(updateQuery, updateValues, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Error updating email.",
          });
        }
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Your email has been updated successfully.",
        });
      });
    } else {
      // Generate unsubscribe token
      const token = gen(20);

      // Insert new email with the generated token
      const registQuery = "INSERT INTO emails(email, name, is_consent, unsubscribe_token) VALUES(?, ?, ?, ?)";
      const registQueryValues = [email, name, isConsent, token];

      dbconnection.query(registQuery, registQueryValues, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Error registering email.",
          });
        }
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message: "Your email has been registered successfully.",
        });
      });
    }
  });
};
