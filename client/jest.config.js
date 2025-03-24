/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  moduleNameMapper: {
    '^.+\\.css?$': '<rootDir>/src/__mock__/cssMock.js',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': ['ts-jest', {}],
  },
};
