import request from "supertest";
import { createApp } from "../../src/app.js";
import { Todo } from "../../src/models/todo.model.js";
import { setupDb, teardownDb, resetDb } from "../__helpers__/setupTestDb.js";

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(resetDb);

describe("Get Single Todo", () => {
  test("GET /api/todos/:id returns todo by id", async () => {
    const todo = await Todo.create({ title: "Test Todo" });
    const app = createApp();

    const res = await request(app).get(`/api/todos/${todo._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Test Todo");
    expect(res.body._id).toBe(todo._id.toString());
  });

  test("GET /api/todos/:id returns 404 for non-existent id", async () => {
    const app = createApp();
    const fakeId = "507f1f77bcf86cd799439011"; // Valid ObjectId format

    const res = await request(app).get(`/api/todos/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.message).toMatch(/not found/i);
  });

  test("GET /api/todos/:id returns 400 for invalid id format", async () => {
    const app = createApp();
    const res = await request(app).get("/api/todos/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error.message).toBe("Invalid id");
  });
});

describe("Update Todo", () => {
  test("PATCH /api/todos/:id updates todo fields", async () => {
    const todo = await Todo.create({ title: "Old Title", priority: "low" });
    const app = createApp();

    const res = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send({ title: "New Title", priority: "high" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.priority).toBe("high");
  });

  test("PATCH /api/todos/:id updates only provided fields", async () => {
    const todo = await Todo.create({
      title: "Original",
      priority: "low",
      completed: false,
    });
    const app = createApp();

    const res = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Original"); // Unchanged
    expect(res.body.priority).toBe("low"); // Unchanged
    expect(res.body.completed).toBe(true); // Updated
  });

  test("PATCH /api/todos/:id validates updated fields", async () => {
    const todo = await Todo.create({ title: "Test" });
    const app = createApp();

    const res = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send({ title: "ab" }); // Too short

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("message");
  });

  test("PATCH /api/todos/:id returns 404 for non-existent todo", async () => {
    const app = createApp();
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .patch(`/api/todos/${fakeId}`)
      .send({ title: "Updated" });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toMatch(/not found/i);
  });

  test("PATCH /api/todos/:id returns 400 for invalid id format", async () => {
    const app = createApp();
    const res = await request(app)
      .patch("/api/todos/invalid-id")
      .send({ title: "Updated" });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Invalid id");
  });
});

describe("Toggle Todo Completed", () => {
  test("PATCH /api/todos/:id/toggle flips completed from false to true", async () => {
    const todo = await Todo.create({ title: "Test", completed: false });
    const app = createApp();

    const res = await request(app).patch(`/api/todos/${todo._id}/toggle`);

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.title).toBe("Test"); // Other fields unchanged
  });

  test("PATCH /api/todos/:id/toggle flips completed from true to false", async () => {
    const todo = await Todo.create({ title: "Test", completed: true });
    const app = createApp();

    const res = await request(app).patch(`/api/todos/${todo._id}/toggle`);

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(false);
  });

  test("PATCH /api/todos/:id/toggle can be called multiple times", async () => {
    const todo = await Todo.create({ title: "Test", completed: false });
    const app = createApp();

    // Toggle to true
    const res1 = await request(app).patch(`/api/todos/${todo._id}/toggle`);
    expect(res1.body.completed).toBe(true);

    // Toggle back to false
    const res2 = await request(app).patch(`/api/todos/${todo._id}/toggle`);
    expect(res2.body.completed).toBe(false);

    // Toggle to true again
    const res3 = await request(app).patch(`/api/todos/${todo._id}/toggle`);
    expect(res3.body.completed).toBe(true);
  });

  test("PATCH /api/todos/:id/toggle returns 404 for non-existent todo", async () => {
    const app = createApp();
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).patch(`/api/todos/${fakeId}/toggle`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toMatch(/not found/i);
  });

  test("PATCH /api/todos/:id/toggle returns 400 for invalid id format", async () => {
    const app = createApp();
    const res = await request(app).patch("/api/todos/invalid-id/toggle");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Invalid id");
  });
});

describe("Delete Todo", () => {
  test("DELETE /api/todos/:id removes todo from database", async () => {
    const todo = await Todo.create({ title: "To Delete" });
    const app = createApp();

    const res = await request(app).delete(`/api/todos/${todo._id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    // Verify it's actually deleted
    const found = await Todo.findById(todo._id);
    expect(found).toBeNull();
  });

  test("DELETE /api/todos/:id returns 404 for non-existent todo", async () => {
    const app = createApp();
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).delete(`/api/todos/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toMatch(/not found/i);
  });

  test("DELETE /api/todos/:id returns 400 for invalid id format", async () => {
    const app = createApp();
    const res = await request(app).delete("/api/todos/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Invalid id");
  });

  test("DELETE /api/todos/:id does not affect other todos", async () => {
    const todo1 = await Todo.create({ title: "Keep this" });
    const todo2 = await Todo.create({ title: "Delete this" });
    const todo3 = await Todo.create({ title: "Keep this too" });
    const app = createApp();

    await request(app).delete(`/api/todos/${todo2._id}`);

    const remaining = await Todo.find({});
    expect(remaining).toHaveLength(2);
    expect(remaining.map((t) => t.title)).toContain("Keep this");
    expect(remaining.map((t) => t.title)).toContain("Keep this too");
    expect(remaining.map((t) => t.title)).not.toContain("Delete this");
  });
});
