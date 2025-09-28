import express, { Request, Response } from "express";
import { signin, signout, signup } from "../controllers/authController";
const router = express.Router();
router.get("/health", (req: Request, res: Response) => {
  res.send("Auth routes working fine!");
});
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
export default router;
