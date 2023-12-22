const path = require('path')

const mode = process.env.NODE_ENV || 'development'

const baseConfig = {
  // experiments: {outputModule: true},
  mode,
  entry: {
    lavadome: path.resolve(__dirname, 'src/LavaDome.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
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
          filename: 'demo/[hash][ext][query]',
        },
      },
    ],
  },
  optimization: {
    usedExports: false,
  },
}

module.exports = baseConfig
