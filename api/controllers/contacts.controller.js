import { dbconnection } from "../config/dbconnect.js";
import { transporter } from "../config/mail.js";

export const getContacts = async(req,res)=>{
const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 9;

try {

// Step 1: Query to get contacts
let contactQuery = `
 SELECT 
 contact_id AS contactId , 
 contact_name AS contactName, 
 contact_email AS contactEmail, 
 subject, 
 message,
 is_responded AS isResponded,
 submission_date AS submissionDate 
 FROM contacts`;

let params = [];

if (req.query.contactId) {
  contactQuery += ` WHERE contact_id = ?`;
  params.push(req.query.contactId);
}

// Validate the order value and prevent SQL injection
const order = req.query.order === "asc" ? "ASC" : "DESC";
contactQuery += ` ORDER BY submission_date ${order}`;

// Add limit and offset
contactQuery += ` LIMIT ? OFFSET ?`;
params = [...params, limit, offset];


const [contacts] = await dbconnection.promise().query(contactQuery, params);

if (contacts.length === 0) {
  return res.status(200).json([]); // No posts found
}

return res.status(200).json(contacts);
} catch (err) {
console.error(err);
res.status(500).json({
  success: false,
  statusCode: 500,
  message: "Internal server error.",
});
}

};

export const sendContact  = (req,res)=>{
  try{
    let {name , email , subject , message} = req.body;
    if(!name || !email || !subject || !message) return res.status(400).json({success:false,statusCode:400,message:"All fields are required"})
      const addQuery = "INSERT INTO contacts(contact_name,contact_email,subject,message) VALUES(?,?,?,?)"
      const addQueryValues = [name,email,subject,message];
  
      dbconnection.query(addQuery,addQueryValues,(err,addResult)=>{
        if(err) return res.status(500).json({success:false,statusCode:500,message:"Error happened while sending contact."})
          res.status(200).json({success:true,statusCode:200,message:"Your contact has been sent successfully."})
      })
  }catch(error){
    res.status(500).json({success:false,statusCode:500,message:"Internal server error!"})
  }

}

export const respondContact = async (req,res)=>{
  let contactId = req.body.contactId;
  let respone = req.body.response;
  if(!contactId || !respone) return res.status(400).json({success:false,statusCode:400,message:"All fields are required."});
  try{
    //Get the email of the contact
    const getEmailQuery = "SELECT contact_email AS email FROM contacts WHERE contact_id = ?";
    const [getEmailResult] = await dbconnection.promise().query(getEmailQuery,[contactId]);
    const contactEmail = getEmailResult[0].email;

    //Send a mail
    const info = await transporter.sendMail({
      from: '"Blockblaze" <contact@blockblaze.net>', // Sender address
      to:contactEmail,
      subject:"Thanks for contacting me.", // Subject line
      html: respone, // HTML body
    });

    //Mark as responded
    const respondedQuery = "UPDATE contacts SET is_responded = true WHERE contact_id = ?"
    const [respondedResult] = await dbconnection.promise().query(respondedQuery,[contactId]);
    res.status(200).json({
      success: true,
      statusCode: 500,
      message: "Contact has been responded.",
    });


  }catch(err){
  console.error(err);
  res.status(500).json({
  success: false,
  statusCode: 500,
  message: "Internal server error.",
});
  }
}

export const deleteContact = async(req,res)=>{
const contactId = req.params.contactId;

if(!contactId) return res.status(400).json({
  success: false,
  statusCode: 400,
  message: "Contact id is required.",
});

try{
  // Delete from posts table
  const deleteContactQuery = "DELETE FROM contacts WHERE contact_id = ?";
  const [deleteContactResult] = await dbconnection.promise().execute(deleteContactQuery, [contactId]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Contact has been deleted successfully.",
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