module.exports = {
    presets: [
        ["@babel/preset-env", {
            targets: {
                node: "current"
            }
        }],
        ["@babel/preset-typescript"],
    ],

    plugins: [
        ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": true }],
        ["@babel/plugin-proposal-optional-chaining", { "loose": true }],
        ["@babel/plugin-proposal-class-properties",
            { "loose": true }],
        ["@babel/transform-runtime"],
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
    ],
};