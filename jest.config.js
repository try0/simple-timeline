module.exports = {
    verbose: true,
    testEnvironment: 'jsdom',
    testMatch: [
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        '.(css|less)$': '<rootDir>/jest-config/style-mock.js'
    }
};