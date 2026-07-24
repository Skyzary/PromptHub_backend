import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const expiresIn = process.env.ACCESS_EXPIRES;
const refreshExpiresIn = process.env.REFRESH_EXPIRES;

export class JwtGenerator {
  generateAccessToken;
  generateRefreshToken;
  verifyAccessToken;
  verifyRefreshToken;

  constructor() {
    this.generateAccessToken = async (email: string) => {
      if (!accessSecret || !expiresIn) {
        throw new Error("Missing access secret or expiration time.");
      }
      const options: jwt.SignOptions = {
        expiresIn: expiresIn as StringValue,
        algorithm: "HS256",
      };

      return jwt.sign({ email }, accessSecret, options);
    };

    this.generateRefreshToken = async (email: string) => {
      if (!refreshSecret || !refreshExpiresIn) {
        throw new Error("Missing refresh secret or expiration time.");
      }
      const options: SignOptions = {
        expiresIn: refreshExpiresIn as StringValue,
      };
      return jwt.sign({ email }, refreshSecret, options);
    };

    this.verifyAccessToken = async (token: string) => {
      if (!accessSecret) {
        throw new Error("Missing access secret.");
      }
      return jwt.verify(token, accessSecret);
    };

    this.verifyRefreshToken = async (token: string) => {
      if (!refreshSecret) {
        throw new Error("Missing refresh secret.");
      }
      return jwt.verify(token, refreshSecret);
    };
  }
}
