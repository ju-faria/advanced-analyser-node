module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["jest-extended/all"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!**/dist/**"
  ]
};