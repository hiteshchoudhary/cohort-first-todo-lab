import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB } from "../../src/db/connect.js";

describe("Database Connection", () => {
  let mongo;

  afterEach(async () => {
    // Close any open connections after each test
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    if (mongo) {
      await mongo.stop();
    }
  });

  test("connectDB establishes connection successfully", async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    const conn = await connectDB(uri);

    expect(conn).toBeDefined();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  test("connectDB throws error when URI is missing", async () => {
    await expect(connectDB()).rejects.toThrow("MongoDB URI is required");
  });

  test("connectDB throws error for empty string URI", async () => {
    await expect(connectDB("")).rejects.toThrow("MongoDB URI is required");
  });
});
