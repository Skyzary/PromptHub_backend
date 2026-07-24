import { Router } from "express";
import { PromptService } from "../services/prompt.services.ts";
import type {
  CreatePromptBody,
  UpdatePromptTitle,
  DeletePrompt,
  UpdatePromptBody,
  UpdatePromptTags,
} from "../types/prompt.types.ts";
import protect from "../middelware/protect.ts";
const promptsRouter: Router = Router();
const promptService = new PromptService();
promptsRouter.post("/create", protect, async (req, res) => {
  const { email, title, body, tags } = req.body as CreatePromptBody;
  await promptService.createPrompt({ email, title, body, tags });
  return res.status(201).json({ message: "Prompt created successfully." });
});
promptsRouter.patch("/change/title", protect, async (req, res) => {
  const { email, promptId, title } = req.body as UpdatePromptTitle;
  await promptService.updatePromptTitle({ email, promptId, title });
  return res
    .status(200)
    .json({ message: "Prompt title updated successfully." });
});
promptsRouter.delete("/delete", protect, async (req, res) => {
  const { email, promptId } = req.body as DeletePrompt;
  await promptService.deletePrompt({ email, promptId });
  return res.status(200).json({ message: "Prompt deleted successfully." });
});
promptsRouter.patch("/change/body", protect, async (req, res) => {
  const { email, promptId, body } = req.body as UpdatePromptBody;
  await promptService.updatePromptBody({ email, promptId, body });
  return res.status(200).json({ message: "Prompt body updated successfully." });
});
promptsRouter.patch("/change/tags", protect, async (req, res) => {
  const { email, promptId, tags } = req.body as UpdatePromptTags;
  await promptService.updatePromptTags({ email, promptId, tags });
  return res.status(200).json({ message: "Prompt tags updated successfully." });
});
export default promptsRouter;
