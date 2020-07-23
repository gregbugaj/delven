// https://huafu.github.io/ts-jest/user/config/diagnostics

module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },

    globals: {
      'ts-jest': {
        diagnostics: {
          ignoreCodes: [2571, 6031, 18003, 2339, 2345, 2366, 7005, 2322, 2454, 7053, 7034, 2741, 7006, 7016] ,
          pathRegex: /\.(spec|test)\.ts$/
        }
      }
    },

    "bail": 1
    
  };