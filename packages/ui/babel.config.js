module.exports= {
    presets: [
        ["@babel/preset-env", {
            targets: {
                node: "current"
            }
        }],
        ["@babel/react"],
        ["@babel/preset-typescript", { "onlyRemoveTypeImports": true }]
    ],

    plugins: [

        ["@babel/plugin-transform-runtime",
            {
            "regenerator": true
            }
        ],

        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-nullish-coalescing-operator"],
        ["@babel/plugin-proposal-optional-chaining", { "loose": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-methods", { "loose": true }],

        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],

        // ["babel-plugin-parameter-decorator"],
    ],
};
