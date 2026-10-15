import type {
  CreatePromptBody,
  UpdatePromptBody,
  UpdatePromptTitle,
  UpdatePromptTags,
  UpdatePromptIcon,
  DeletePrompt,
  IPrompt,
} from "../types/prompt.types.ts";
import { userModel } from "../models/user-model.ts";

export class PromptService {
  async getPrompts(email: string): Promise<IPrompt[]> {
    if (!email) {
      throw new Error("Email is required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    return user.prompts ?? [];
  }

  async createPrompt(createPromptData: CreatePromptBody): Promise<void> {
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
  }

  async updatePromptTitle(
    updatePromptTitleData: UpdatePromptTitle,
  ): Promise<void> {
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
  }

  async updatePromptBody(
    updatePromptBodyData: UpdatePromptBody,
  ): Promise<void> {
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
  }

  async updatePromptTags(
    updatePromptTagsData: UpdatePromptTags,
  ): Promise<void> {
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
  }

  async updatePromptIcon(
    updatePromptIconData: UpdatePromptIcon,
  ): Promise<void> {
    const { email, promptId, icon } = updatePromptIconData;
    if (!email || !promptId || !icon) {
      throw new Error("Prompt ID, email and icon are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user || !user.prompts) {
      throw new Error("User or prompts not found.");
    }
    const prompt = user.prompts.find((p) => p._id?.toString() === promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    prompt.icon = icon;
    await user.save();
  }

  async deletePrompt(deletePromptData: DeletePrompt): Promise<void> {
    const { email, promptId } = deletePromptData;
    if (!email || !promptId) {
      throw new Error("Email and prompt ID are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user || !user.prompts) {
      throw new Error("User or prompts not found.");
    }
    const prompt = user.prompts.find((p) => p._id?.toString() === promptId);
    if (!prompt) {
      throw new Error("Prompt not found.");
    }
    user.prompts = user.prompts.filter((p) => p._id?.toString() !== promptId);
    await user.save();
  }

  async deleteAllPrompts(email: string): Promise<void> {
    if (!email) {
      throw new Error("Email is required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    user.prompts = [];
    await user.save();
  }
}
