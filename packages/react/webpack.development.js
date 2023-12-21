const { merge } = require('webpack-merge')
require('webpack-dev-server')

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')

const baseConfig = require('./webpack.config')

const devtool = process.env.DEVTOOL || 'eval-cheap-module-source-map'

const host = process.env.SERVE_HOST || 'localhost'
const port = process.env.PORT || 8080

const config = merge(baseConfig, {
  devtool,
  devServer: {
    host,
    port,
    static: {
      directory: path.resolve(__dirname, 'static'),
    },
    hot: true,
    liveReload: true,
    open: false,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
})

module.exports = config
