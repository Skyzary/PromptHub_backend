import request from "supertest";
import { createApp } from "../../src/app.ts";
import {
  connectTestDb,
  clearTestDb,
  closeTestDb,
} from "../helpers/db.ts";

const app = createApp();

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe("Auth Routes (/api/auth)", () => {
  const validUser = {
    email: "test@example.com",
    password: "Password1!",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User registered successfully.");
    });

    it("should return 400 if user already exists", async () => {
      await request(app).post("/api/auth/register").send(validUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "User already exists.");
    });

    it("should return 400 if password does not meet requirements", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "simplepassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("should login successfully and return tokens", async () => {
      const res = await request(app).post("/api/auth/login").send(validUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 for incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: "WrongPassword1!",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials.");
    });

    it("should return 401 for non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "unknown@example.com",
        password: "Password1!",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials.");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear refreshToken cookie on logout", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Logout successful.");
    });
  });
});
