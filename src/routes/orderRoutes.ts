import express, { Request, Response } from "express";
import {
  createOrder,
  updateOrderStatus,
  //getUserIncomingRequests,
  //getUserOutgoingRequests,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();
// Test route
router.get("/health", (req: Request, res: Response) => {
  res.send("Order routes working fine!");
});

router.post("/create", authMiddleware, createOrder as any);
router.patch("/:orderId", authMiddleware, updateOrderStatus as any);
//router.get("/incoming/:userId", authMiddleware, getUserIncomingRequests as any);
//router.get("/outgoing/:userId", authMiddleware, getUserOutgoingRequests as any);
export default router;
