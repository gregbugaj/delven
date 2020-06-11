var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './public/js/main.js',
    output: {
        path: path.resolve(__dirname, 'public/js/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};