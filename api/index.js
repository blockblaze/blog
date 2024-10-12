import express from "express";
import { dbconnection } from "./config/dbconnect.js";
import  contactRoute from "./routes/contacts.route.js";

const app = express();
const port = 3000;

dbconnection.connect();

app.use("/api/contact",contactRoute)

// app.get("/", function (req, res) {
//   dbconnection.query(
//     "SELECT * FROM posts WHERE post_id = 2",
//     function (err, result) {
//       if (err) return res.status(500).send(err);
//       res.status(200).json(result);
//     }
//   );
// });

// Start the server
app.listen(port, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`Server running on port ${port}`);
  }
});

// Close the dbconnection gracefully when the process is terminated
const gracefulShutdown = () => {
  dbconnection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
    } else {
      console.log("Database connection closed");
    }
    process.exit();
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
