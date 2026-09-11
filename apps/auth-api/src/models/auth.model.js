import { prisma } from "./../configs/db.config.js";

export const UserModel = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  create({ email, passwordHash, name }) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });
  },
};