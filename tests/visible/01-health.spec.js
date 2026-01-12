import request from "supertest";
import { createApp } from "../../src/app.js";

describe("Health Check", () => {
  test("GET /health returns 200 status with ok:true", async () => {
    const app = createApp();
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
