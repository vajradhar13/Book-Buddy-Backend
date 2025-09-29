import express, { Request, Response } from "express";
import prisma from "../utils/prisma";
import { createBookSchema, updateBookSchema } from "../common/bookValidator";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const createBook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createBookSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    console.log(req.user.userId);
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User info missing." });
    }
    const bookData = {
      ...parsed.data,
      ownerId: req.user?.userId,
    };

    const newBook = await prisma.book.create({
      data: bookData,
    });

    return res.status(201).json(newBook);
  } catch (error: any) {
    return res.status(500).json({ error });
  }
};
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ data: books });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const getAllBooksFiltered = async (req: Request, res: Response) => {
  try {
    const {
      genre,
      ageGroup,
      availabilityType,
      status,
      ownerId,
      page = "1",
      limit = "10",
    } = req.query;

    // Convert pagination to numbers
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filters: any = {};

    if (genre) filters.genre = genre;
    if (ageGroup) filters.ageGroup = ageGroup;
    if (availabilityType) filters.availabilityType = availabilityType;
    if (status) filters.status = status;
    if (ownerId) filters.ownerId = Number(ownerId);

    // Fetch books
    const books = await prisma.book.findMany({
      where: filters,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
    });

    // Total count (for frontend pagination)
    const totalBooks = await prisma.book.count({ where: filters });

    res.status(200).json({
      data: books,
      meta: {
        total: totalBooks,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalBooks / limitNumber),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const parsed = updateBookSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: parsed.data,
    });

    res.status(200).json(updatedBook);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    await prisma.book.delete({
      where: { id },
    });

    res.status(200).send("Deleted Successfully");
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
