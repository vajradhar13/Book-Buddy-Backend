import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import orderRoutes from "./routes/orderRoutes";

import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(express.json());

app.use(cookieParser());
// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Welcome to Book-Buddy-platform");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/order", orderRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler");
  res.status(500).json({
    message: "Internal Server Error",
  });
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
