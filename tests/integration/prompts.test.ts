import request from "supertest";
import { createApp } from "../../src/app.ts";
import { userModel } from "../../src/models/user-model.ts";
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

describe("Prompts Routes (/api/prompts)", () => {
  const user = {
    email: "promptuser@example.com",
    password: "Password1!",
  };

  const getAuthToken = async () => {
    await request(app).post("/api/auth/register").send(user);
    const loginRes = await request(app).post("/api/auth/login").send(user);
    return loginRes.body.accessToken;
  };

  describe("POST /api/prompts/create", () => {
    it("should create a prompt for authenticated user", async () => {
      const token = await getAuthToken();

      const res = await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "My Prompt",
          body: "Act as a software engineer...",
          tags: ["tech", "coding"],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt created successfully.",
      );

      const updatedUser = await userModel.findOne({ email: user.email });
      expect(updatedUser?.prompts).toHaveLength(1);
      expect(updatedUser?.prompts?.[0]?.title).toBe("My Prompt");
    });

    it("should return 401 when token is missing", async () => {
      const res = await request(app)
        .post("/api/prompts/create")
        .send({
          title: "My Prompt",
          body: "Act as a software engineer...",
          tags: ["tech"],
        });

      expect(res.status).toBe(401);
    });
  });

  describe("Updating and deleting prompts", () => {
    let token: string;
    let promptId: string;

    beforeEach(async () => {
      token = await getAuthToken();
      await request(app)
        .post("/api/prompts/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Initial Title",
          body: "Initial Body",
          tags: ["initial"],
        });

      const dbUser = await userModel.findOne({ email: user.email });
      promptId = dbUser!.prompts![0]!._id!.toString();
    });

    it("should update prompt title", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/title")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          title: "Updated Title",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt title updated successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts?.[0]?.title).toBe("Updated Title");
    });

    it("should update prompt body", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/body")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          body: "Updated Body Content",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt body updated successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts?.[0]?.body).toBe("Updated Body Content");
    });

    it("should update prompt tags", async () => {
      const res = await request(app)
        .patch("/api/prompts/change/tags")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
          tags: ["new-tag", "updated"],
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt tags updated successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts?.[0]?.tags).toEqual(["new-tag", "updated"]);
    });

    it("should delete prompt", async () => {
      const res = await request(app)
        .delete("/api/prompts/delete")
        .set("Authorization", `Bearer ${token}`)
        .send({
          promptId,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Prompt deleted successfully.",
      );

      const dbUser = await userModel.findOne({ email: user.email });
      expect(dbUser?.prompts).toHaveLength(0);
    });
  });
});
