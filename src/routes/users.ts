import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import {
  updateEmailSchema,
  updatePasswordSchema,
} from "../validation/user-validation.ts";
import protect from "../middleware/protect.ts";

const userRouter: Router = Router();
const userService = new UserService();

userRouter.get("/", protect, async (_req, res) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json({ users });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return res.status(500).json({ error: message });
  }
});

userRouter.get("/:email", protect, async (req, res) => {
  try {
    const email = req.params.email;
    if (typeof email !== "string") {
      return res.status(400).json({ error: "Email parameter is required." });
    }
    const user = await userService.getUserByEmail(email);
    return res.status(200).json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    const status = message === "User not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

userRouter.delete("/", protect, async (req, res) => {
  try {
    const email = req.user!.email;
    await userService.deleteUser(email);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Delete user failed";
    const status = message === "User not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

userRouter.put("/email", protect, async (req, res) => {
  try {
    const email = req.user!.email;
    const validation = updateEmailSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { newEmail } = validation.data;
    await userService.updateEmail(email, newEmail);
    return res
      .status(200)
      .json({ message: "User email updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Update email failed";
    const status = message === "User not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

userRouter.patch("/password", protect, async (req, res) => {
  try {
    const email = req.user!.email;
    const validation = updatePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }

    const { newPassword } = validation.data;
    await userService.updatePassword(email, newPassword);
    return res
      .status(200)
      .json({ message: "User password updated successfully." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Update password failed";
    const status = message === "User not found." ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

export default userRouter;
