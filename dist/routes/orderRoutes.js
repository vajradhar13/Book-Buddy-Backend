"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// Test route
router.get("/health", (req, res) => {
    res.send("Order routes working fine!");
});
// Dashboard APIs
router.get("/incoming/:userId", orderController_1.getUserIncomingRequests);
router.get("/outgoing/:userId", orderController_1.getUserOutgoingRequests);
exports.default = router;
