const { PrismaClient } = require("@prisma/client");

// poori app ke liye ek hi shared client
const prisma = new PrismaClient();

module.exports = prisma;