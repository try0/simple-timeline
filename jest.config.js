module.exports = {
    verbose: true,
    testMatch: [
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        '.(css|less)$': '<rootDir>/jest-config/style-mock.js'
    }
};