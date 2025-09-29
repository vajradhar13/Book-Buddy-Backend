"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/all", authMiddleware_1.authMiddleware, bookController_1.getAllBooks);
router.get("/", authMiddleware_1.authMiddleware, bookController_1.getAllBooksFiltered);
router.post("/create", authMiddleware_1.authMiddleware, bookController_1.createBook);
router.get("/:id", authMiddleware_1.authMiddleware, bookController_1.getBookById);
router.put("/:id", authMiddleware_1.authMiddleware, bookController_1.updateBook);
router.delete("/:id", authMiddleware_1.authMiddleware, bookController_1.deleteBook);
exports.default = router;
