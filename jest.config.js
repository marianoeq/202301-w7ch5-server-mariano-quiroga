/** @type {import('ts-jest').JestConfigWithTsJest} */ export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'router',
    'db',
    'user.monogo.model.ts',
    'things.mongo.model.ts',
    'config.ts',
  ],
};
