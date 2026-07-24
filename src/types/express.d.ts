import type { IUser } from "./user.types.ts";

declare module "express" {
  export interface Request {
    user?: IUser;
  }
}
