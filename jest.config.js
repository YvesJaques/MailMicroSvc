const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: '@shelf/jest-mongodb',
  clearMocks: true, 
  collectCoverage: true,  
  collectCoverageFrom: [
    "src/services/**/*.ts"
  ],  
  coverageDirectory: "__tests__/coverage",
  coverageProvider: "v8",
  coverageReporters: [
    "json",  
    "lcov",    
  ], 
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),  
  testMatch: [
    "<rootDir>/src/**/*.spec.ts",
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
