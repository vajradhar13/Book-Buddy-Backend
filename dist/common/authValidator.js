"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.z
        .string()
        .email({ message: "Please provide a valid email address" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
    avatar: zod_1.z.string().url({ message: "Avatar must be a valid URL" }).optional(),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Please provide a valid email address" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
});
exports.updateUserSchema = exports.signUpSchema.omit({
    password: true,
});
