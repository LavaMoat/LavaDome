const { optimize: WebpackOptimize } = require('webpack')
const { ModuleConcatenationPlugin } = WebpackOptimize

const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.config')

const devtool = process.env.DEVTOOL || 'nosources-source-map'

const config = merge(baseConfig, {
  mode: 'production',
  devtool,
  optimization: {
    concatenateModules: true,
  },
  plugins: [new ModuleConcatenationPlugin()],
})

module.exports = config
