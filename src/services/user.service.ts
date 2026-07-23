import { userModel } from "../models/user-model.ts";
import bcrypt from "bcrypt";
import type { IUser } from "../models/user-model.ts";

export class UserService {
  createUser: (userData: IUser) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
  updateEmail: (email: string, newEmail: string) => Promise<void>;

  constructor() {
    this.createUser = async (userData) => {
      if (!userData.email || !userData.password) {
        throw new Error("Email and password are required to create a user.");
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUserData = { ...userData, password: hashedPassword };

      try {
        const newUser = new userModel(newUserData);
        await newUser.save();
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to create user: ${error.message}`);
        }
        throw new Error(`Failed to create user: ${error}`);
      }
    };

    this.deleteUser = async (email: string) => {
      if (!email) {
        throw new Error("Email is required to delete a user.");
      }
      try {
        const result = await userModel.deleteOne({ email });
        if (result.deletedCount === 0) {
          throw new Error("User not found.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to delete user: ${error.message}`);
        }
        throw new Error(`Failed to delete user: ${error}`);
      }
    };

    this.updatePassword = async (email: string, newPassword: string) => {
      if (!email || !newPassword) {
        throw new Error(
          "Email and new password are required to update a user.",
        );
      }
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await userModel.updateOne(
          { email },
          { password: hashedPassword },
        );
        if (result.matchedCount === 0) {
          throw new Error("User not found.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to update user: ${error.message}`);
        }
        throw new Error(`Failed to update user: ${error}`);
      }
    };

    this.updateEmail = async (email: string, newEmail: string) => {
      if (!email || !newEmail) {
        throw new Error("Email and new email are required to update a user.");
      }
      try {
        const result = await userModel.updateOne(
          { email },
          { email: newEmail },
        );
        if (result.matchedCount === 0) {
          throw new Error("User not found.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to update user: ${error.message}`);
        }
        throw new Error(`Failed to update user: ${error}`);
      }
    };
  }
}
