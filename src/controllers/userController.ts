import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { updateUserSchema } from "../common/authValidator"; // assuming you have a zod schema here

// Update user info
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma specific error: Record not found
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

// Get user profile (typically by logged in user ID from middleware)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Assuming user ID is available on req.user set by auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        // other fields you want to expose
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all users (possibly with pagination or filters)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Optional pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        // exclude sensitive info like password
      },
    });

    const totalUsers = await prisma.user.count();

    return res.status(200).json({
      data: users,
      meta: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
