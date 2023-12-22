const { optimize: WebpackOptimize } = require('webpack')
const { ModuleConcatenationPlugin, LimitChunkCountPlugin } = WebpackOptimize
const { merge } = require('webpack-merge')

const path = require('path')

const baseConfig = require('./webpack.config')
baseConfig.module.rules[0].exclude.push(path.resolve(__dirname, 'demo'))

const devtool = process.env.DEVTOOL || 'nosources-source-map'

const config = merge(baseConfig, {
  mode: 'production',
  devtool,
  optimization: {
    concatenateModules: true,
  },
  plugins: [
      new ModuleConcatenationPlugin(),
      new LimitChunkCountPlugin({
        maxChunks: 1
      })
  ],
})

module.exports = config
