"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/health", (req, res) => {
    res.send("User routes working fine!");
});
router.get("/", userController_1.getAllUsers); //ekkad middleware add cheyali
router.put("/update/:id", userController_1.updateUser);
router.get("/profile/:id", userController_1.getUserProfile);
exports.default = router;
