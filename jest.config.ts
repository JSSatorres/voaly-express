/** @jest-config-loader ts-node */
import type { Config } from 'jest'

const config: Config = {
  // Test environment
  testEnvironment: 'node',

  // Test files pattern
  testMatch: ['**/tests/**/*.test.ts'],

  // Enable globals (describe, it, expect)
  injectGlobals: true,

  // TypeScript transformation with ESM support
  preset: 'ts-jest/presets/default-esm',

  // ES Modules support
  extensionsToTreatAsEsm: ['.ts'],

  // Transform configuration
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'esnext'
        }
      }
    ]
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Module name mapping for path aliases and .js extensions
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  // File extensions
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Coverage configuration
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html']
}

export default config

// import type {Config} from 'jest';

// const config: Config = {
//   verbose: true,
// };

// export default config;
