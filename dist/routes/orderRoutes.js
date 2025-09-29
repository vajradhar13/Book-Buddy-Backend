"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Test route
router.get("/health", (req, res) => {
    res.send("Order routes working fine!");
});
router.post("/create", authMiddleware_1.authMiddleware, orderController_1.createOrder);
router.patch("/:orderId", authMiddleware_1.authMiddleware, orderController_1.updateOrderStatus);
//router.get("/incoming/:userId", authMiddleware, getUserIncomingRequests as any);
//router.get("/outgoing/:userId", authMiddleware, getUserOutgoingRequests as any);
exports.default = router;
