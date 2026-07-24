import type { CreatePromptBody } from "../types/prompt.types.ts";

export class PromptService {
  createPrompt: (email: string, promptData: CreatePromptBody) => Promise<void>;
  constructor() {}
}
