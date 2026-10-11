import request from "supertest";
import { createApp } from "../../src/app.ts";
import { connectTestDb, clearTestDb, closeTestDb } from "../helpers/db.ts";

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

describe("Users Routes (/api/users)", () => {
  const user = {
    email: "user@example.com",
    password: "Password1!",
  };

  const getAuthToken = async () => {
    await request(app).post("/api/auth/register").send(user);
    const loginRes = await request(app).post("/api/auth/login").send(user);
    return loginRes.body.accessToken;
  };

  describe("PUT /api/users/email", () => {
    it("should update user email", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .put("/api/users/email")
        .set("Authorization", `Bearer ${token}`)
        .send({ newEmail: "updated@example.com" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "User email updated successfully.",
      );
    });

    it("should return 401 if unauthorized", async () => {
      const res = await request(app)
        .put("/api/users/email")
        .send({ newEmail: "updated@example.com" });

      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/users/password", () => {
    it("should update user password", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .patch("/api/users/password")
        .set("Authorization", `Bearer ${token}`)
        .send({ newPassword: "NewPassword2@" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "User password updated successfully.",
      );
    });
  });

  describe("DELETE /api/users", () => {
    it("should delete current user", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .delete("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully.");
    });
  });
});
