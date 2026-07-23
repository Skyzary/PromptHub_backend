import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import type {
  UpdateEmailBody,
  UpdatePasswordBody,
  UserParams,
} from "../types/user.types.ts";
import {
  updateEmailSchema,
  updatePasswordSchema,
} from "../validation/user-validation.ts";

const userRouter: Router = Router();
const userService = new UserService();

userRouter.delete("/users/:email", async (req, res) => {
  const { email } = req.params as UserParams;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to delete a user." });
  }

  await userService.deleteUser(email);
  res.status(200).json({ message: "User deleted successfully." });
});

userRouter.put("/users/:email", async (req, res) => {
  const { email } = req.params as UserParams;
  const { newEmail } = req.body as UpdateEmailBody;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to update a user." });
  }

  const validation = updateEmailSchema.safeParse({ newEmail });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  await userService.updateEmail(email, newEmail);
  res.status(200).json({ message: "User email updated successfully." });
});

userRouter.patch("/users/:email/password", async (req, res) => {
  const { email } = req.params as UserParams;
  const { newPassword } = req.body as UpdatePasswordBody;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to update a password." });
  }

  const validation = updatePasswordSchema.safeParse({ newPassword });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  await userService.updatePassword(email, newPassword);
  res.status(200).json({ message: "User password updated successfully." });
});

export default userRouter;
