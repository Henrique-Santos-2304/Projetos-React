module.exports = {
   testPathIgnorePatterns: ["/node_modules/", "/.next/"],
   transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
   },
   setupFilesAfterEnv: ["<rootDir>/src/tests/setupTest.ts"],
   testEnvironment: "jsdom",
   moduleNameMapper: { "\\.(sass|scss|css)$": "identity-obj-proxy" }
}
