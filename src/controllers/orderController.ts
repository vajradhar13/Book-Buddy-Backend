import { Request, Response } from "express";
import prisma from "../utils/prisma";

// 👇 All orders where the logged-in user is the OWNER (incoming requests)
export const getUserIncomingRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const incomingOrders = await prisma.orders.findMany({
      where: { ownerId: userId },
      include: {
        // Include related book and offeredBook
        book: true,
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        // Optional: include the offered book in exchange requests
        offeredBook: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: incomingOrders });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

// 👆 All orders where the logged-in user is the REQUESTER (outgoing requests)
export const getUserOutgoingRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const outgoingOrders = await prisma.orders.findMany({
      where: { requesterId: userId },
      include: {
        book: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        offeredBook: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: outgoingOrders });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
