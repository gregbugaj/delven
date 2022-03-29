const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

const paths = require('./paths')

// Reference for some of the issues
// https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = {
  name:'server',
  target: 'node',

  // Where webpack looks to start building the bundle
  entry: [
    'reflect-metadata',
    paths.src + '/index.ts'
  ],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    // filename: '[name].bundle.js',
    filename: 'index.js',
    publicPath: '/',
  },

  // Required in order to prevent following error
  // WARNING in ./node_modules/express/lib/view.js 81:13-25
  // Critical dependency: the request of a dependency is an expression
  externals: [nodeExternals(), { 'express': { commonjs: 'express' } }],

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              "sourceMap": !isProduction,
            }
          }
        },
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: [".tsx", ".ts",'.js', '.jsx', '.json'],

    // // There is no need for fallback as we run in node context
    // fallback: {
    //     fs: false,
    //     net: false,
    //     "path": require.resolve("path-browserify"),
    //     "os": require.resolve("os-browserify/browser"),
    //     "crypto": require.resolve("crypto-browserify"),
    //     "stream": require.resolve("stream-browserify") ,
    //      buffer: require.resolve('buffer/'),
    // },
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
}
