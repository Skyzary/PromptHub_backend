import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^(\\.{1,2}/.*)\\.ts$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "nodenext",
          target: "esnext",
          moduleResolution: "nodenext",
          allowImportingTsExtensions: true,
          noEmit: true,
          ignoreDeprecations: "6.0",
        },
      },
    ],
  },
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  verbose: true,
};

export default config;
