import type { IPrompt } from "./prompt.types.ts";
import type { JwtPayload } from "jsonwebtoken";
export interface IUser {
  email: string;
  password: string;
  registeredAt: Date;
  prompts?: Array<IPrompt>;
}
export interface CreateUserBody {
  email: string;
  password: string;
}

export interface UpdateEmailBody {
  newEmail: string;
}

export interface UpdatePasswordBody {
  newPassword: string;
}

export interface UserParams {
  email: string;
}
export interface Payload extends JwtPayload {
  email: string;
}
