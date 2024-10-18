module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: [
      "default",
      "jest-spec-reporter",
    ],
    testMatch: ['**/tests/integration/**/*.test.ts'],
  };
  