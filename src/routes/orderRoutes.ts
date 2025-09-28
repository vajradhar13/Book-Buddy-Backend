import express, { Request, Response } from "express";
import {
  getUserIncomingRequests,
  getUserOutgoingRequests,
} from "../controllers/orderController";
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();
// Test route
router.get("/health", (req: Request, res: Response) => {
  res.send("Order routes working fine!");
});

// Dashboard APIs
router.get("/incoming/:userId", authMiddleware, getUserIncomingRequests);
router.get("/outgoing/:userId", authMiddleware, getUserOutgoingRequests);
export default router;
