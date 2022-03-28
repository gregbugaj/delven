import { Configuration as WebpackDevServerConfiguration, WebpackConfiguration } from 'webpack-dev-server';

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

// ref : https://www.pluralsight.com/guides/react-typescript-webpack
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  // devtool: 'inline-source-map',
  devtool: 'source-map',

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: false,
    hot: true,
    port: 8080,
  },

  // https://webpack.js.org/configuration/experiments/
  experiments: {
    topLevelAwait: true,
  },

  optimization: {
    minimize: false,
  },

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          // { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
});

console.info(config);
export default config;
