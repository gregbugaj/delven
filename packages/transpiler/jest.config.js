// https://huafu.github.io/ts-jest/user/config/diagnostics

module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(spec|test).+(ts|tsx|js)",
        "**/?(*.)\\.+(spec|test).+(ts|tsx|js)"
    ],
    // USING babel-jest fixes issue with 'para?.val' not being able to be parsed in tests
    "transform": {
        //   "^.+\\.(ts|tsx)$": "ts-jest"
        // transforming JS files as they are using ES6 module system
        "^.+\\.(ts|tsx|js)$": "babel-jest"
    },

    globals: {
        'ts-jest': {
            diagnostics: {
                ignoreCodes: [2571, 6031, 18003, 2339, 2345, 2366, 7005, 2322, 2454, 7053, 7034, 2741, 7006, 7016],
                pathRegex: /\.(spec|test)\.ts$/
            }
        }
    },

    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
    "bail": 1
};