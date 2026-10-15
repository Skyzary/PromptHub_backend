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

  describe("GET /api/users", () => {
    it("should return list of all users without passwords", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("users");
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBe(1);
      expect(res.body.users[0].email).toBe(user.email);
      expect(res.body.users[0].password).toBeUndefined();
    });

    it("should return 401 if unauthorized", async () => {
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/users/:email", () => {
    it("should return user by email without password", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .get(`/api/users/${user.email}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.password).toBeUndefined();
    });

    it("should return 404 for non-existent user", async () => {
      const token = await getAuthToken();
      const res = await request(app)
        .get("/api/users/notfound@example.com")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found.");
    });

    it("should return 401 if unauthorized", async () => {
      const res = await request(app).get(`/api/users/${user.email}`);
      expect(res.status).toBe(401);
    });
  });

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
