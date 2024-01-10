const path = require('path');
const fs = require('fs');

const mode = process.env.NODE_ENV || 'development';
const dir = [__dirname, 'packages', process.env.LD_PKG];

const baseConfig = {
  // experiments: {outputModule: true},
  mode,
  entry: {},
  output: {
    path: path.resolve(...dir, 'build'),
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
        exclude: [],
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
};

if (fs.existsSync(path.join(...dir, 'src/index.mjs'))) {
  baseConfig.entry.main = path.resolve(...dir, 'src/index.mjs');
} else {
  baseConfig.entry.main = path.resolve(...dir, 'src/index');
}

module.exports = baseConfig
