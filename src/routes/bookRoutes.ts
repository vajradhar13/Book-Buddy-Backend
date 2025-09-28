import express, { Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getAllBooksFiltered,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/bookController";
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();
// Test route
// router.get("/health", (req: Request, res: Response) => {
//   res.send("Book routes working fine!!");
// });
router.get("/all", authMiddleware, getAllBooks); // supports filters & pagination
router.get("/", authMiddleware, getAllBooksFiltered); // supports filters & pagination
router.post("/create", authMiddleware, createBook);
router.get("/:id", authMiddleware, getBookById);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

// User-specific books
// router.get("/user/:userId", getUserBooks);
export default router;
