import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo;

/**
 * Sets up an in-memory MongoDB instance for testing.
 * This function is called once before all tests run.
 */
export async function setupDb() {
  // Create and start the in-memory MongoDB server
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Connect mongoose to the in-memory database
  await mongoose.connect(uri);
}

/**
 * Tears down the in-memory MongoDB instance after all tests complete.
 * This function is called once after all tests finish.
 */
export async function teardownDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (mongo) {
    await mongo.stop();
  }
}

/**
 * Resets the database by clearing all collections.
 * This function is called before each test to ensure test isolation.
 */
export async function resetDb() {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}
