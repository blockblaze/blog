const express = require("express");

const app = express();
const port = 3000;

app.get("/",function(req,res){
    res.status(200).json({"message":"work"})
})

// Start the server
app.listen(port, (error) => {
    if (error) {
      console.error("Error starting server:", error);
    } else {
      console.log(`Server running on port ${port}`);
    }
  });