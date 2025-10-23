import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/dbConnection";
import userRoutes from "./routes/userRoute";
import taskRoutes from './routes/taskRoutes';
import authUser from "./middlewares/authentication";

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "3000");


app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Trullo Backend API is running!", status: "OK" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/users", userRoutes);
app.use("/tasks", authUser, taskRoutes);

(async () => {
  try {
    console.log("Starting server...");
    console.log("Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: PORT,
      MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Missing",
      DB_NAME: process.env.DB_NAME,
      JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Missing"
    });
    
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err);
    process.exit(1);
  }
})();

export default app;