import request from "supertest";
import { createApp } from "../../src/app.js";
import { Todo } from "../../src/models/todo.model.js";
import { setupDb, teardownDb, resetDb } from "../__helpers__/setupTestDb.js";

beforeAll(setupDb);
afterAll(teardownDb);
beforeEach(resetDb);

describe("List Todos", () => {
  test("GET /api/todos returns empty array when no todos exist", async () => {
    const app = createApp();
    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toEqual({
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    });
  });

  test("GET /api/todos returns all todos with pagination meta", async () => {
    await Todo.create({ title: "Todo 1" });
    await Todo.create({ title: "Todo 2" });
    await Todo.create({ title: "Todo 3" });

    const app = createApp();
    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta).toMatchObject({
      total: 3,
      page: 1,
      limit: 10,
      pages: 1,
    });
  });

  test("GET /api/todos supports pagination with page parameter", async () => {
    // Create 15 todos
    for (let i = 1; i <= 15; i++) {
      await Todo.create({ title: `Todo ${i}` });
    }

    const app = createApp();
    const res = await request(app).get("/api/todos?page=2&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.meta).toMatchObject({
      total: 15,
      page: 2,
      limit: 5,
      pages: 3,
    });
  });

  test("GET /api/todos supports custom limit parameter", async () => {
    for (let i = 1; i <= 20; i++) {
      await Todo.create({ title: `Todo ${i}` });
    }

    const app = createApp();
    const res = await request(app).get("/api/todos?limit=7");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(7);
    expect(res.body.meta.limit).toBe(7);
    expect(res.body.meta.pages).toBe(3); // 20 / 7 = 3 pages
  });

  test("GET /api/todos defaults to page 1 and limit 10", async () => {
    for (let i = 1; i <= 5; i++) {
      await Todo.create({ title: `Todo ${i}` });
    }

    const app = createApp();
    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(10);
  });

  test("GET /api/todos filters by completed=true", async () => {
    await Todo.create({ title: "Done", completed: true });
    await Todo.create({ title: "Not done", completed: false });
    await Todo.create({ title: "Also done", completed: true });

    const app = createApp();
    const res = await request(app).get("/api/todos?completed=true");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((t) => t.completed === true)).toBe(true);
    expect(res.body.meta.total).toBe(2);
  });

  test("GET /api/todos filters by completed=false", async () => {
    await Todo.create({ title: "Done", completed: true });
    await Todo.create({ title: "Not done", completed: false });
    await Todo.create({ title: "Also not done", completed: false });

    const app = createApp();
    const res = await request(app).get("/api/todos?completed=false");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((t) => t.completed === false)).toBe(true);
  });

  test("GET /api/todos filters by priority", async () => {
    await Todo.create({ title: "High priority", priority: "high" });
    await Todo.create({ title: "Low priority", priority: "low" });
    await Todo.create({ title: "High priority 2", priority: "high" });

    const app = createApp();
    const res = await request(app).get("/api/todos?priority=high");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((t) => t.priority === "high")).toBe(true);
  });

  test("GET /api/todos searches title (case-insensitive)", async () => {
    await Todo.create({ title: "Learn Express" });
    await Todo.create({ title: "Learn Mongoose" });
    await Todo.create({ title: "Build API" });

    const app = createApp();
    const res = await request(app).get("/api/todos?search=learn");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.total).toBe(2);
    expect(
      res.body.data.every((t) => t.title.toLowerCase().includes("learn"))
    ).toBe(true);
  });

  test("GET /api/todos search is case-insensitive", async () => {
    await Todo.create({ title: "UPPERCASE TITLE" });
    await Todo.create({ title: "lowercase title" });
    await Todo.create({ title: "MixedCase Title" });

    const app = createApp();
    const res = await request(app).get("/api/todos?search=TITLE");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });

  test("GET /api/todos sorts by createdAt descending (newest first)", async () => {
    const first = await Todo.create({ title: "First" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const second = await Todo.create({ title: "Second" });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const third = await Todo.create({ title: "Third" });

    const app = createApp();
    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("Third"); // Newest first
    expect(res.body.data[1].title).toBe("Second");
    expect(res.body.data[2].title).toBe("First"); // Oldest last
  });

  test("GET /api/todos combines filters and pagination", async () => {
    // Create 10 high priority completed todos
    for (let i = 1; i <= 10; i++) {
      await Todo.create({
        title: `High Priority ${i}`,
        priority: "high",
        completed: true,
      });
    }
    // Create 5 low priority incomplete todos
    for (let i = 1; i <= 5; i++) {
      await Todo.create({
        title: `Low Priority ${i}`,
        priority: "low",
        completed: false,
      });
    }

    const app = createApp();
    const res = await request(app).get(
      "/api/todos?priority=high&completed=true&page=2&limit=3"
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta).toMatchObject({
      total: 10,
      page: 2,
      limit: 3,
      pages: 4,
    });
    expect(res.body.data.every((t) => t.priority === "high")).toBe(true);
    expect(res.body.data.every((t) => t.completed === true)).toBe(true);
  });

  test("GET /api/todos handles page beyond available pages", async () => {
    await Todo.create({ title: "Only one" });

    const app = createApp();
    const res = await request(app).get("/api/todos?page=5");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toMatchObject({
      total: 1,
      page: 5,
      limit: 10,
      pages: 1,
    });
  });
});
