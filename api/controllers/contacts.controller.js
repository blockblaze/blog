import { dbconnection } from "../config/dbconnect.js";

export const sendContact  = (req,res)=>{
  try{
    let {name , email , subject , message} = req.body;
    if(!name || !email || !subject || !message) return res.status(400).json({sucess:false,statusCode:400,message:"All fields are required"})
      const addQuery = "INSERT INTO contacts(contact_name,contact_email,contact_subject,contact_message) VALUES(?,?,?,?)"
      const addQueryValues = [name,email,subject,message];
  
      dbconnection.query(addQuery,addQueryValues,(err,addResult)=>{
        if(err) return res.status(500).json({sucess:false,statusCode:500,message:"Error happened while sending contact."})
          res.status(200).json({sucess:true,statusCode:200,message:"Contact has been sent successfully."})
      })
  }catch(error){
    res.status(500).json({sucess:false,statusCode:500,message:"Internal server error!"})
  }

}