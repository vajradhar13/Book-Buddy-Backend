"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Update user info
// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const userId = parseInt(req.params.id);
//     if (isNaN(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     const parsed = updateUserSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({ error: parsed.error.issues });
//     }
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: parsed.data,
//     });
//     return res.status(200).json(updatedUser);
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       // Prisma specific error: Record not found
//       return res.status(404).json({ error: "User not found" });
//     }
//     return res.status(500).json({ error: "Server error" });
//   }
// };
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getUserProfile = getUserProfile;
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const users = await prisma_1.default.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        const totalUsers = await prisma_1.default.user.count();
        return res.status(200).json({
            data: users,
            meta: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
