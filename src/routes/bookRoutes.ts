import express, { Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getAllBooksFiltered,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/bookController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/all", authMiddleware, getAllBooks);
router.get("/", authMiddleware, getAllBooksFiltered);
router.post("/create", authMiddleware, createBook as any);
router.get("/:id", authMiddleware, getBookById);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

export default router;
