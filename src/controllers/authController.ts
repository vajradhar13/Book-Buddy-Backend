import { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import { signUpSchema, signInSchema } from "../common/authValidator";
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const { name, email, password, avatar } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
export const signin = async (req: Request, res: Response) => {
  try {
    const parsed = signInSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
export const signout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
