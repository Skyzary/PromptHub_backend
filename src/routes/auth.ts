import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import { JwtGenerator } from "../utils/jwt-generator.ts";
import type { CreateUserBody, Payload } from "../types/user.types.ts";
import { userSchema } from "../validation/user-validation.ts";
import type { IUser } from "../types/user.types.ts";
import bcrypt from "bcrypt";

const authRouter: Router = Router();
const userService = new UserService();
const jwtGenerator = new JwtGenerator();

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body as CreateUserBody;

  const validation = userSchema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  await userService.createUser({ email, password } as IUser);
  return res.status(201).json({ message: "User registered successfully." });
});
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as CreateUserBody;
  const validation = userSchema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = await userService.findUser(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const accessToken = await jwtGenerator.generateAccessToken(email);
  const refreshToken = await jwtGenerator.generateRefreshToken(email);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ accessToken, refreshToken });
});
authRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required." });
  }
  const payload = await jwtGenerator.verifyToken(refreshToken);

  if (
    !payload ||
    typeof payload !== "object" ||
    !("email" in payload) ||
    typeof (payload as Payload).email !== "string"
  ) {
    return res.status(401).json({ error: "Invalid refresh token." });
  }
  const accessToken = await jwtGenerator.generateAccessToken(payload.email);
  return res.status(200).json({ accessToken });
});
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout successful." });
});
export default authRouter;
