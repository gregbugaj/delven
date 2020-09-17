const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'delven.js',
        libraryTarget: 'umd2',
        library: "delven",
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["@babel/preset-env"]
                }
            }
        ],
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'npm-dist'),
                }
            ],
        }),
    ],

    resolve: {
        extensions: ['.ts', '.js'],
    },

    mode: 'development',
    devtool: 'sourceMap',

    // Fixed:  Module not found: Error: Can't resolve 'fs' in         
    target: 'node', // node, web, electron-renderer
    /*
    node: {
        fs: "empty"
    },
    */
};