"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooksFiltered = exports.getAllBooks = exports.createBook = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bookValidator_1 = require("../common/bookValidator");
const createBook = async (req, res) => {
    try {
        const parsed = bookValidator_1.createBookSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const newBook = await prisma_1.default.book.create({
            data: parsed.data,
        });
        return res.status(201).json(newBook);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.createBook = createBook;
const getAllBooks = async (req, res) => {
    try {
        const books = await prisma_1.default.book.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ data: books });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllBooks = getAllBooks;
const getAllBooksFiltered = async (req, res) => {
    try {
        const { genre, ageGroup, availabilityType, status, ownerId, page = "1", limit = "10", } = req.query;
        // Convert pagination to numbers
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Build filter object
        const filters = {};
        if (genre)
            filters.genre = genre;
        if (ageGroup)
            filters.ageGroup = ageGroup;
        if (availabilityType)
            filters.availabilityType = availabilityType;
        if (status)
            filters.status = status;
        if (ownerId)
            filters.ownerId = Number(ownerId);
        // Fetch books
        const books = await prisma_1.default.book.findMany({
            where: filters,
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
        });
        // Total count (for frontend pagination)
        const totalBooks = await prisma_1.default.book.count({ where: filters });
        res.status(200).json({
            data: books,
            meta: {
                total: totalBooks,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalBooks / limitNumber),
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllBooksFiltered = getAllBooksFiltered;
// ===== 📘 Get Book by ID ===== //
const getBookById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }
        const book = await prisma_1.default.book.findUnique({
            where: { id },
        });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getBookById = getBookById;
// ===== ✏️ Update Book ===== //
const updateBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }
        const parsed = bookValidator_1.updateBookSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const updatedBook = await prisma_1.default.book.update({
            where: { id },
            data: parsed.data,
        });
        res.status(200).json(updatedBook);
    }
    catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(500).json({ error: "Server error" });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid book ID" });
        }
        await prisma_1.default.book.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteBook = deleteBook;
