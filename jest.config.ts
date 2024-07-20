/*
 * Copyright© 2024 Ronan LE MEILLAT for SCTG Development,
 * Association High Can Fly and Les Ailes du Mont-Blanc
 *
 * Up2Pay is free software: you can redistribute it and/or modify
 * it under the terms of the Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Up2Pay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with Up2Pay. If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 */
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