import request from "supertest";
import { createApp } from "../../src/app.js";
import { Todo } from "../../src/models/todo.model.js";
import { setupDb, teardownDb, resetDb } from "../__helpers__/setupTestDb.js";

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(resetDb);

describe("Create Todo", () => {
  test("POST /api/todos creates todo with minimal data", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Learn Mongoose" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Learn Mongoose",
      completed: false,
      priority: "medium",
    });
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
  });

  test("POST /api/todos creates todo with all fields", async () => {
    const app = createApp();
    const dueDate = new Date("2026-12-31");

    const res = await request(app)
      .post("/api/todos")
      .send({
        title: "Complete assignment",
        completed: true,
        priority: "high",
        tags: ["school", "urgent"],
        dueDate: dueDate.toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Complete assignment");
    expect(res.body.completed).toBe(true);
    expect(res.body.priority).toBe("high");
    expect(res.body.tags).toEqual(["school", "urgent"]);
    expect(new Date(res.body.dueDate).toISOString()).toBe(
      dueDate.toISOString()
    );
  });

  test("POST /api/todos validates title is required", async () => {
    const app = createApp();
    const res = await request(app).post("/api/todos").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.message).toMatch(/title/i);
  });

  test("POST /api/todos validates title minimum length (3 chars)", async () => {
    const app = createApp();
    const res = await request(app).post("/api/todos").send({ title: "ab" });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.message).toMatch(/3/);
  });

  test("POST /api/todos validates title maximum length (120 chars)", async () => {
    const app = createApp();
    const longTitle = "a".repeat(121);
    const res = await request(app).post("/api/todos").send({ title: longTitle });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.message).toMatch(/120/);
  });

  test("POST /api/todos validates priority enum values", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Test", priority: "urgent" });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/priority/i);
  });

  test("POST /api/todos accepts valid priority values", async () => {
    const app = createApp();
    const priorities = ["low", "medium", "high"];

    for (const priority of priorities) {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: `Test ${priority}`, priority });

      expect(res.status).toBe(201);
      expect(res.body.priority).toBe(priority);
    }
  });

  test("POST /api/todos trims title whitespace", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "  Trimmed Title  " });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Trimmed Title");
  });

  test("POST /api/todos sets default values correctly", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/todos")
      .send({ title: "Test defaults" });

    expect(res.status).toBe(201);
    expect(res.body.completed).toBe(false);
    expect(res.body.priority).toBe("medium");
    expect(res.body.tags).toEqual([]);
  });
});
