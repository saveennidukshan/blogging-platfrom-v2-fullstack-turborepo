import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { UserModel } from "./auth.model.js";
import { generateToken } from "./../../utils/tokenService.js";
import { producer } from "./../../infrastructure/kafka/kafkaProducer.js";
import { prisma } from "../../infrastructure/database/databaseConnection.js";


export const register = async ({ email, password, name }) => {
  const existingUser = await UserModel.findByEmail(email);

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    await tx.auth_outbox.create({
      data:{
        email
      }
    })
    return user;
  })

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const login = async ({ email, password }) => {
  const user = await UserModel.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  const event = {
      eventId: randomUUID(),
      eventType: "user.logged",
      occurredAt: new Date().toISOString(),
      data: {
        email,
        name:user.name,
      },
    };

    await producer.send({
      topic: "user-events",
      acks: -1,
      messages: [
        {
          key: user.email,
          value: JSON.stringify(event),
        },
      ],
    });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
};