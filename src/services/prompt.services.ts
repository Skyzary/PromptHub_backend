import type {
  CreatePromptBody,
  UpdatePromptBody,
  UpdatePromptTitle,
  UpdatePromptTags,
} from "../types/prompt.types.ts";
import { userModel } from "../models/user-model.ts";

export class PromptService {
  createPrompt: (promptData: CreatePromptBody) => Promise<void>; // Create a new prompt
  updatePromptTitle: (
    updatePromptTitleBody: UpdatePromptTitle,
  ) => Promise<void>; // Update the title of a prompt
  updatePromptBody: (updatePromptBodyBody: UpdatePromptBody) => Promise<void>; // Update the body of a prompt
  updatePromptTags: (updatePromptTagsBody: UpdatePromptTags) => Promise<void>; // Update the tags of a prompt
  constructor() {
    this.createPrompt = async (createPromptData: CreatePromptBody) => {
      const { email, ...promptData } = createPromptData;
      if (!email || !promptData) {
        throw new Error("Email and prompt data are required.");
      }
      const user = await userModel.findOne({ email });
      if (!user || !user.prompts) {
        throw new Error("User or prompts not found.");
      }
      user.prompts.push(promptData);
      await user.save();
    };
    this.updatePromptTitle = async (
      updatePromptTitleData: UpdatePromptTitle,
    ) => {
      const { email, promptId, title } = updatePromptTitleData;
      if (!promptId || !title || !email) {
        throw new Error("Prompt ID, email and title are required.");
      }
      const user = await userModel.findOne({ email });
      if (!user?.prompts) {
        throw new Error("User or prompts not found.");
      }
      const prompt = user.prompts.find((p) => p._id?.toString() === promptId);
      if (!prompt) {
        throw new Error("Prompt not found.");
      }
      prompt.title = title;
      await user.save();
    };
    this.updatePromptBody = async (updatePromptBodyData: UpdatePromptBody) => {
      const { email, promptId, body } = updatePromptBodyData;
      if (!email || !promptId || !body) {
        throw new Error("Email, prompt ID and body are required.");
      }
      const user = await userModel.findOne({ email });
      if (!user || !user.prompts) {
        throw new Error("User or prompts not found.");
      }
      const prompt = user.prompts.find((p) => p._id?.toString() === promptId);
      if (!prompt) {
        throw new Error("Prompt not found.");
      }
      prompt.body = body;
      await user.save();
    };
    this.updatePromptTags = async (updatePromptTagsData: UpdatePromptTags) => {
      const { email, promptId, tags } = updatePromptTagsData;
      if (!email || !promptId || !tags) {
        throw new Error("Prompt ID, email and tags are required.");
      }
      const user = await userModel.findOne({ email });
      if (!user || !user.prompts) {
        throw new Error("User or prompts not found.");
      }
      const prompt = user.prompts.find((p) => p._id?.toString() === promptId);
      if (!prompt) {
        throw new Error("Prompt not found.");
      }
      prompt.tags = tags;
      await user.save();
    };
  }
}
