const { merge } = require('webpack-merge')
require('webpack-dev-server')

const path = require('path')

const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseConfig = require('../../webpack.config');
baseConfig.entry['demo'] = path.resolve(__dirname, 'demo/index.js');

const devtool = process.env.DEVTOOL || 'eval-cheap-module-source-map'

const host = process.env.SERVE_HOST || 'localhost'
const port = process.env.PORT || 3000

const config = merge(baseConfig, {
  devtool,
  devServer: {
    host,
    port,
    static: {
      directory: path.resolve(__dirname, 'demo'),
    },
    hot: true,
    liveReload: true,
    open: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'demo/index.html'),
    })
  ],
})

module.exports = config
