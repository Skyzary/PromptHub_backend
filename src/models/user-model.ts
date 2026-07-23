import { Schema, model } from "mongoose";

export interface IPrompt {
  title: string;
  body: string;
  createdAt: Date;
  tags: Array<string>;
}

export interface IUser {
  email: string;
  password: string;
  registeredAt: Date;
  prompts?: Array<IPrompt>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, required: true, default: Date.now },
  prompts: [
    {
      title: { type: String, required: true },
      body: { type: String, required: true },
      createdAt: { type: Date, required: true, default: Date.now },
      tags: { type: [{ type: String }], required: false },
    },
  ],
});

export const userModel = model<IUser>("UserModel", userSchema);
