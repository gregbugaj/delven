import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import nodeExternals from 'webpack-node-externals';
import paths from './paths.mjs';

// Reference for some of the issues
// https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

const common = {
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
  externals: [nodeExternals(), { 'express': { module: 'express' } }],

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
        use: [
          {
            loader: "ts-loader",
            // optionsXXX: {
            //   cacheDirectory: false,
						// 	presets: [
            //     ["@babel/preset-env", { targets: { node: "14" } }],
            //     [
            //       "@babel/preset-typescript",
            //       {  allExtensions: true }
            //     ]
            //   ]
            // }
          },
          // "ts-loader"
        ],
        exclude: /node_modules/
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

export default common
