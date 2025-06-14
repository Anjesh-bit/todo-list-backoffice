import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "./config/db";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB, then start server
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1); // Exit if DB connection fails
  });
