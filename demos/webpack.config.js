var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var PlaceAssetsPlugin = require('html-webpack-place-assets-plugin');
var contextPath = path.resolve(__dirname);

module.exports = {
  context: contextPath,
  entry: {
    'index': './js/vue.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  // externals: ['rxjs'],
  devServer: {
    open: true,
    port: 8080,
    contentBase: path.join(__dirname, "dist"),
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.vue', '.json', '.css'],
    alias: {
      'data-hub': path.resolve(__dirname, '../index.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            attrs: ['img:src'],
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false,
            interpolate: 'require',
          }
        }]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: [
              'babel-loader'
            ],
            css: [
              'vue-style-loader',
              'css-loader'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.jsx$/,
        use: [
          'babel-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './vue.html',
      filename: 'index.html',
      chunks: ['index'],
      chunksSortMode: 'dependency', //'dependency',
      inject: false
    }),
    new PlaceAssetsPlugin({
      headReplaceExp: /<!-- html-webpack-plugin-css -->/,
      bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
      tagsJoin: '\n  ',
    }),
    new webpack.NamedModulesPlugin()
  ]
}
