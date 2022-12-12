import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  collectCoverage: true,
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  roots: [
    "<rootDir>/src"
  ],
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageReporters: [
    "html",
    "text",
    "lcov"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

export default config;