import jwt from "jsonwebtoken";
import configs from "../config/dotenv.config.js";

const JWT_SECRET = configs.jwt_secret_key;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: configs.jwt_expires_in,
    }
  );
};