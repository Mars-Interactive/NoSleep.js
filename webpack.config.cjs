const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

const { version, author, license } = require("./package.json");

const BANNER = `[name].js v${version} - git.io/vfn01 - ${author} - ${license} license`;

const commonConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',

  module: {
    rules: [
      {
        test: /\.js$/,
        // Babel loader picks up .babelrc automatically
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({ banner: BANNER }),
  ],

  resolve: {
    extensions: ['.js']
  },
};

// --- UMD Configuration (For <script> tags and require()) ---
const umdConfig = {
  ...commonConfig,
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'NoSleep.umd.js',
    library: {
      name: 'NoSleep',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
};

// --- Minified UMD Configuration ---
const minifiedConfig = {
  ...umdConfig,
  output: {
    ...umdConfig.output,
    filename: 'NoSleep.min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

// --- ESM Configuration (For 'module' field and tree-shaking) ---
const esmConfig = {
  ...commonConfig,
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'NoSleep.esm.js',
    library: {
        type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: false,
  },
};

module.exports = [umdConfig, minifiedConfig, esmConfig];
