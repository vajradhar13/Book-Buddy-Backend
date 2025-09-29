import prisma from "../utils/prisma";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Request, Response } from "express";
import { createOrderSchema } from "../common/orderValidator";

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = createOrderSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const { bookId, ownerId, type, offeredBookId } = result.data;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Requested book not found",
      });
    }

    if (book.ownerId === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot request your own book",
      });
    }

    if (book.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This book is not available",
      });
    }

    if (book.availabilityType !== type) {
      return res.status(400).json({
        success: false,
        message: `This book is only available as "${book.availabilityType}"`,
      });
    }

    const existingOrder = await prisma.orders.findFirst({
      where: {
        requesterId: userId,
        requestBookId: bookId,
        orderStatus: { in: ["Pending", "Approved"] },
      },
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or approved request for this book",
      });
    }

    if (type === "Exchange") {
      if (!offeredBookId) {
        return res.status(400).json({
          success: false,
          message: "Exchange requests require an offered book ID",
        });
      }

      const offeredBook = await prisma.book.findFirst({
        where: {
          id: offeredBookId,
          ownerId: userId,
          status: "Available",
        },
      });

      if (!offeredBook) {
        return res.status(400).json({
          success: false,
          message: "Invalid or unavailable offered book for exchange",
        });
      }
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          requesterId: userId,
          requestBookId: bookId,
          ownerId: book.ownerId,
          type,
          offeredBookId: offeredBookId ?? null,
          orderStatus: "Pending",
        },
      });

      await tx.book.update({
        where: { id: bookId },
        data: { status: "Pending" },
      });

      if (type === "Exchange" && offeredBookId) {
        await tx.book.update({
          where: { id: offeredBookId },
          data: { status: "Pending" },
        });
      }

      return order;
    });

    return res.status(201).json({
      success: true,
      message: "Book request created successfully",
      data: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await prisma.orders.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be updated",
      });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.orders.update({
        where: { id: order.id },
        data: { orderStatus: status },
      });

      if (status === "Rejected") {
        await tx.book.update({
          where: { id: order.requestBookId },
          data: { status: "Available" },
        });

        if (order.type === "Exchange" && order.offeredBookId) {
          await tx.book.update({
            where: { id: order.offeredBookId },
            data: { status: "Available" },
          });
        }
      }

      if (status === "Approved") {
        await tx.book.update({
          where: { id: order.requestBookId },
          data: { status: "Shared" },
        });

        if (order.type === "Exchange" && order.offeredBookId) {
          await tx.book.update({
            where: { id: order.offeredBookId },
            data: { status: "Shared" },
          });
        }
      }

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: `Order has been ${status.toLowerCase()}`,
      data: updatedOrder,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
