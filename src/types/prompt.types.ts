export interface CreatePromptBody {
  title: string;
  body: string;
  tags: Array<string>;
}
export interface UpdatePromptTitle {
  promptId: string;
  title: string;
}
export interface UpdatePromptBody {
  promptId: string;
  body: string;
}
export interface UpdatePromptTags {
  promptId: string;
  tags: Array<string>;
}
export interface IPrompt {
  title: string;
  body: string;
  createdAt: Date;
  tags: Array<string>;
}
