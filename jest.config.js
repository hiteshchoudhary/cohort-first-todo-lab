export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.js"],
  verbose: true,
  transform: {}, // Disable babel, use native ESM
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js" // Exclude server startup file from coverage
  ]
};
