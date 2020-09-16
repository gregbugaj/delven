var path = require('path');
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
        ]
    },

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