import { Configuration as WebpackDevServerConfiguration, WebpackConfiguration } from 'webpack-dev-server';

const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

// ref : https://www.pluralsight.com/guides/react-typescript-webpack
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge(common, {
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
        scripts: ['yarn run:dev'],
        blocking: false,
        parallel: true,
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
