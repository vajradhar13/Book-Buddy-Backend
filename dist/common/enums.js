"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityTypeEnum = exports.bookStatusEnum = exports.orderStatusEnum = void 0;
const zod_1 = require("zod");
// Enum values matching your real dataset (PascalCase)
exports.orderStatusEnum = zod_1.z.enum([
    "Pending",
    "Approved",
    "Rejected",
    "Completed",
    "Shared",
]);
exports.bookStatusEnum = zod_1.z.enum([
    "Available",
    "Pending",
    "Approved",
    "Rejected",
    "Shared",
]);
exports.availabilityTypeEnum = zod_1.z.enum(["Free", "Exchange"]);
