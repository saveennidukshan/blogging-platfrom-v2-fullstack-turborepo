import type { RequestHandler } from "express";
import * as AuthService from "./auth.service.js";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const usernameValidate: RequestHandler = async (req, res, next) => {
  try {
    await AuthService.validateUsername(req.body);
    return res.status(200).json({
      success: true,
      message: "Username Validated",
    });
  } catch (error) {
    next(error);
  }
};