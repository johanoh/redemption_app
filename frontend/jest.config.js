export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.js"],
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@shared/(.*)$": "<rootDir>/src/components/shared/$1",
    "^@user/(.*)$": "<rootDir>/src/components/user/$1",
  },
};
