import express, { Request, Response } from "express";
import {
  getAllUsers,
  getUserProfile,
  updateUser,
} from "../controllers/userController";
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();
router.get("/health", (req: Request, res: Response) => {
  res.send("User routes working fine!");
});
router.get("/", authMiddleware, getAllUsers);
router.put("/update/:id", authMiddleware, updateUser);
router.get("/profile/:id", authMiddleware, getUserProfile);
export default router;
