import type { Types } from "mongoose";
export interface CreatePromptBody {
  email: string;
  title: string;
  body: string;
  tags: Array<string>;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface UpdatePromptTitle {
  email: string;
  promptId: string;
  title: string;
}
export interface UpdatePromptBody {
  email: string;
  promptId: string;
  body: string;
}
export interface UpdatePromptTags {
  email: string;
  promptId: string;
  tags: Array<string>;
}
export interface DeletePrompt {
  email: string;
  promptId: string;
}
export interface IPrompt {
  _id?: Types.ObjectId; // появляется после сохранения, при create ещё нет
  title: string;
  body: string;
  createdAt?: Date;
  tags: Array<string>;
}
