const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const isDev = mode === 'development'

const baseConfig = {
  mode,
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-[fullhash].bundle.js',
    chunkFilename: '[name]-[chunkhash].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        loader: 'swc-loader',
      },
      {
        test: /\.(sa|s?c)ss$/i,
        use: [
          'css-loader',
        ],
      },
      {
        test: /\.(eot|woff2?|ttf|svg|png|jpe?g|gifv?|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'static/index.html'),
      hash: true,
      minify: isDev,
    }),
    new CspHtmlWebpackPlugin(
      {},
      {
        hashingMethod: 'sha512',
        hashEnabled: {
          'style-src': isDev,
        },
      }
    ),
  ],
}

module.exports = baseConfig
