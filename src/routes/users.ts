import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import {
  updateEmailSchema,
  updatePasswordSchema,
} from "../validation/user-validation.ts";
import protect from "../middleware/protect.ts";

const userRouter: Router = Router();
const userService = new UserService();

userRouter.delete("/", protect, async (req, res) => {
  try {
    const email = req.user!.email;
    await userService.deleteUser(email);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    const status = error.message === "User not found." ? 404 : 400;
    return res
      .status(status)
      .json({ error: error.message || "Delete user failed" });
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
  } catch (error: any) {
    const status = error.message === "User not found." ? 404 : 400;
    return res
      .status(status)
      .json({ error: error.message || "Update email failed" });
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
  } catch (error: any) {
    const status = error.message === "User not found." ? 404 : 400;
    return res
      .status(status)
      .json({ error: error.message || "Update password failed" });
  }
});

export default userRouter;
