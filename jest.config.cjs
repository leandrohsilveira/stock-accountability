/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^\\$lib/(.*)': '<rootDir>/src/lib/$1',
    '^tests/(.*)': '<rootDir>/tests/$1',
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
}
