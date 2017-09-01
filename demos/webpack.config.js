var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var PlaceAssetsPlugin = require('html-webpack-place-assets-plugin');
var contextPath = path.resolve(__dirname);

module.exports = {
  context: contextPath,
  entry: {
    'index': './js/index.js',
    'vue': './js/vue.js',
    'react': './js/react.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  // externals: ['rxjs'],
  devServer: {
    open: true,
    port: 8181,
    contentBase: path.resolve(__dirname, "./dist"),
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.vue', '.json', '.css'],
    alias: {
      'data-hub': path.resolve(__dirname, '../dist/rx-hub.js'),
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
            ],
            less: [
              'vue-style-loader',
              'css-loader',
              'less-loader'
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
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
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
      template: './index.html',
      filename: 'index.html',
      chunks: ['index'],
      chunksSortMode: 'dependency', //'dependency',
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: './vue.html',
      filename: 'vue.html',
      chunks: ['vue'],
      chunksSortMode: 'dependency', //'dependency',
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: './react.html',
      filename: 'react.html',
      chunks: ['react'],
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
