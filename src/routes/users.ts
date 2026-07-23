import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import type { IUser } from "../models/user-model.ts";
import type {
  CreateUserBody,
  UpdateEmailBody,
  UpdatePasswordBody,
  UserParams,
} from "../types/user.types.ts";
import {
  userSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "../validation/user-validation.ts";

const router: Router = Router();
const userService = new UserService();

router.post("/users", async (req, res) => {
  const { email, password } = req.body as CreateUserBody;

  const validation = userSchema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  try {
    await userService.createUser({ email, password } as IUser);
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

router.delete("/users/:email", async (req, res) => {
  const { email } = req.params as UserParams;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to delete a user." });
  }

  try {
    await userService.deleteUser(email);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: error });
  }
});

router.put("/users/:email", async (req, res) => {
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

  try {
    await userService.updateEmail(email, newEmail);
    res.status(200).json({ message: "User email updated successfully." });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: error });
  }
});

router.patch("/users/:email/password", async (req, res) => {
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

  try {
    await userService.updatePassword(email, newPassword);
    res.status(200).json({ message: "User password updated successfully." });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: error });
  }
});

export default router;
