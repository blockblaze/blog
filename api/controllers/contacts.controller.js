import { dbconnection } from "../config/dbconnect.js";

export const sendContact  = (req,res)=>{
      dbconnection.query(
    "SELECT * FROM posts WHERE post_id = 2",
    function (err, result) {
      if (err) return res.status(500).send(err);
      res.status(200).json(result);
    }
  );
}