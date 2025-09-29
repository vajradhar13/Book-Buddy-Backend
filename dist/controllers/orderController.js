"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const orderValidator_1 = require("../common/orderValidator");
const createOrder = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = orderValidator_1.createOrderSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        const { bookId, ownerId, type, offeredBookId } = result.data;
        const book = await prisma_1.default.book.findUnique({ where: { id: bookId } });
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
        const existingOrder = await prisma_1.default.orders.findFirst({
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
            const offeredBook = await prisma_1.default.book.findFirst({
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
        const newOrder = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
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
        const order = await prisma_1.default.orders.findUnique({
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
        const updatedOrder = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
