import wds from 'webpack-dev-server';
const { Configuration: WebpackDevServerConfiguration, WebpackConfiguration } = wds;

// import { Configuration as WebpackDevServerConfiguration, WebpackConfiguration } from 'webpack-dev-server';
import {merge} from "webpack-merge";
import common from "./webpack.common.js";
// const { merge } = require('webpack-merge');
// const common = require('./webpack.common');
// const WebpackShellPluginNext = require('webpack-shell-plugin-next');
import WebpackShellPluginNext from "webpack-shell-plugin-next";

/*
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('directory-name 👉️', __dirname);
console.log('file-name 👉️', __filename);
*/

// // ref : https://www.pluralsight.com/guides/react-typescript-webpack
// interface Configuration extends WebpackConfiguration {
//   devServer?: WebpackDevServerConfiguration;
// }

const config = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',
  // devtool: 'source-map',

  // Spin up a server for quick development
  // Not required for backend server, using express
  /*
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: false,
    hot: true,
    port: 8080,
  },
  */

  plugins: [
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "===> Starting packing with WEBPACK 5"'],
        blocking: true,
        parallel: false,
      },
      onBuildEnd: {
				scripts: ['echo "===> Completed packing with WEBPACK 5"'],
        scriptsXX: ['yarn run start'],
        blocking: false,
        parallel: false,
      },
    }),
  ],

  // https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },

  optimization: {
    minimize: false,
  },

  module: {
    rules: [],
  },
});

console.info(config);
export default config;
