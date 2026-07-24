import {JwtGenerator} from "../utils/jwt-generator.ts";
import { userModel } from "../models/user-model.ts";
import type { Request, Response, NextFunction } from "express";
const jwtGenerator = new JwtGenerator();
export default async function protect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = await jwtGenerator.verifyToken(token) as { email: string };
    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
