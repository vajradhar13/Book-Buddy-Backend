"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaSingleton {
    static getInstance() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new client_1.PrismaClient();
        }
        return PrismaSingleton.instance;
    }
}
exports.default = PrismaSingleton.getInstance();
