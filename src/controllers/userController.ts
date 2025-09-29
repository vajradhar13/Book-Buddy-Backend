import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { updateUserSchema } from "../common/authValidator"; // assuming you have a zod schema here
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

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

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
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
