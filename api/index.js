import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import path from 'path';



import { dbconnection } from "./config/dbconnect.js";
import  contactRoute from "./routes/contacts.route.js";
import registRoute from "./routes/regist.route.js"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import rateRoute from "./routes/rates.js";
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();


dbconnection.connect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/contact",contactRoute)
app.use("/api",registRoute)
app.use("/api",authRoute)
app.use("/api",rateRoute)
app.use("/api/post",postRoute)

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

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
