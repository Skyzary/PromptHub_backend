import { Router } from "express";
import { UserService } from "../services/user.service.ts";
import {
  updateEmailSchema,
  updatePasswordSchema,
} from "../validation/user-validation.ts";
import protect from "../middleware/protect.ts";

const userRouter: Router = Router();
const userService = new UserService();

function getEmailParam(params: Record<string, string | string[] | undefined>) {
  const email = params.email;
  return typeof email === "string" ? email : undefined;
}

userRouter.delete("/users/:email", protect, async (req, res) => {
  const email = getEmailParam(req.params);
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to delete a user." });
  }

  await userService.deleteUser(email);
  return res.status(200).json({ message: "User deleted successfully." });
});

userRouter.put("/users/:email", protect, async (req, res) => {
  const email = getEmailParam(req.params);
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to update a user." });
  }

  const validation = updateEmailSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  const { newEmail } = validation.data;
  await userService.updateEmail(email, newEmail);
  return res.status(200).json({ message: "User email updated successfully." });
});

userRouter.patch("/users/:email/password", protect, async (req, res) => {
  const email = getEmailParam(req.params);
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to update a password." });
  }

  const validation = updatePasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  const { newPassword } = validation.data;
  await userService.updatePassword(email, newPassword);
  return res
    .status(200)
    .json({ message: "User password updated successfully." });
});

export default userRouter;
