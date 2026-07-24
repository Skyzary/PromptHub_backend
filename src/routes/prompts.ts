import {Router} from "express";
import { PromptService } from "../services/prompt.services.ts";
import type {
  CreatePromptBody,
  UpdatePromptTitle,
  DeletePrompt
} from "../types/prompt.types.ts";
const promptsRouter: Router = Router();
const promptService = new PromptService();
promptsRouter.post("/create", async (req, res) => {
  const { email, title, body, tags } = req.body as CreatePromptBody;
  await promptService.createPrompt({ email, title, body, tags });
  return res.status(201).json({ message: "Prompt created successfully." });
});
promptsRouter.post("/change/title", async (req, res) => {
  const { email, promptId, title } = req.body as UpdatePromptTitle;
  await promptService.updatePromptTitle({ email, promptId, title });
  return res.status(200).json({ message: "Prompt title updated successfully." });
})
promptsRouter.post("/delete", async (req, res) => {
  const {email, promptId} = req.body as DeletePrompt
  await promptService.deletePrompt({ email, promptId });
  return res.status(200).json({ message: "Prompt deleted successfully." });

})
export default promptsRouter;
