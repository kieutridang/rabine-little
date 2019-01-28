const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const res = p => path.resolve(__dirname, p);

const externals = [nodeExternals()];

module.exports = {
  name: 'server',
  target: 'node',
  mode: 'production',
  devtool: 'eval',
  entry: {
    index: [
      'babel-polyfill',
      res('./index.js')
    ]
  },
  externals,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          warnings: false
        }
      })
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  node: {
    __filename: true,
    __dirname: true
  },
  output: {
    path: res('./build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  resolve: {
    mainFields: ['main', 'module'],
    extensions: ['.js']
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new webpack.DefinePlugin({
      'process.env.ENV': JSON.stringify(process.env.ENV),
      'process.env.AWS_ACCESS_KEY': JSON.stringify(process.env.AWS_ACCESS_KEY),
      'process.env.AWS_SECRET_KEY': JSON.stringify(process.env.AWS_SECRET_KEY),
      'process.env.AWS_REGION': JSON.stringify(process.env.AWS_REGION),
      'process.env.AWS_API_VERSION': JSON.stringify(process.env.AWS_API_VERSION),
      'process.env.AWS_S3_URL': JSON.stringify(process.env.AWS_S3_URL),
      'process.env.DRONE_KEY': JSON.stringify(process.env.DRONE_KEY),
      'process.env.EXPORT_EMAIL': JSON.stringify(process.env.EXPORT_EMAIL),
      'process.env.EXPORT_PROJECTION': JSON.stringify(process.env.EXPORT_PROJECTION),
      'process.env.AWS_BUCKET': JSON.stringify(process.env.AWS_BUCKET),
      'process.env.IMAGE_LAMBDA_URL': JSON.stringify(process.env.IMAGE_LAMBDA_URL),
      'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
      'process.env.ENFORCE_SSL': JSON.stringify(process.env.ENFORCE_SSL),
      'process.env.MONGODB_URI': JSON.stringify(process.env.MONGODB_URI),
      'process.env.AWS_RABINE_UPLIFT': JSON.stringify(process.env.AWS_RABINE_UPLIFT),
      'process.env.CLIENT_URL': JSON.stringify(process.env.CLIENT_URL),
      'process.env.PRODUCT_NAME': JSON.stringify(process.env.PRODUCT_NAME),
      'process.env.PRIMARY_EMAIL': JSON.stringify(process.env.PRIMARY_EMAIL),
      'process.env.SENDGRID_API_USER': JSON.stringify(process.env.SENDGRID_API_USER),
      'process.env.SENDGRID_API_KEY': JSON.stringify(process.env.SENDGRID_API_KEY)
    })
  ]
};
