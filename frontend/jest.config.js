// jest.config.js
export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.js"],
  moduleFileExtensions: ["js", "jsx"],
};
