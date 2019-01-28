/**
 * COMMON WEBPACK CONFIGURATION
 */
// const CopywebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const path = require('path');
const webpack = require('webpack');
// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

module.exports = (options) => ({
  externals: {
    cesium: 'Cesium',
  },
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',

    // Needed to compile multiline strings in Cesium
    sourcePrefix: '',
  }, options.output), // Merge with env dependent settings
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  module: {
    rules: [
      {
        test: /(pdfkit|linebreak|fontkit|unicode|brotli|png-js).*\.js$/,
        use: [
          {
            loader: 'transform-loader?brfs',
          },
          {
            loader: 'babel-loader',
            query: {
              plugins: ['transform-decorators-legacy'],
              presets: ['env', 'stage-0', 'react'],
            },
          },
        ],
      },

      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        test: /\.pdf$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: options.plugins.concat([


    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(process.env.ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
        ENFORCE_SSL: JSON.stringify(process.env.ENFORCE_SSL),
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('/cesium'),
      },
    }),
    new webpack.NamedModulesPlugin(),

    // new CopywebpackPlugin([
    //   {
    //     from: 'node_modules/cesium/Build/Cesium',
    //     to: 'cesium',
    //   },
    // ]),
    // Including Cesium Assets, Widgets, and Workers
    // new HtmlWebpackIncludeAssetsPlugin({
    //   append: false,
    //   assets: [
    //     'cesium/Widgets/widgets.css',
    //     'cesium/Cesium.js',
    //   ],
    // }),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'main',
      'jsnext:main',
    ],
    alias: {
      moment$: 'moment/moment.js',
      // Cesium module name
      cesiumSource: 'cesium',
      cesium: 'cesium/Cesium',
    },
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
