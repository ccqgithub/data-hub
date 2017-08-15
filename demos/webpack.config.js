var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var PlaceAssetsPlugin = require('html-webpack-place-assets-plugin');
var contextPath = path.resolve(__dirname);

var babelLoaderOptions = {
  loader: 'babel-loader',
  options: {
    'presets': [
      'react',
      ['env', {
        'targets': {
          'browsers': ['> 1%', 'ie >= 8']
        },
        useBuiltIns: true
      }],
      'stage-2',
      'stage-3',
    ],
  }
}

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
      'node_modules',
      path.resolve(contextPath, '../node_modules')
    ],
    extensions: ['.js', '.jsx', '.vue', '.json'],
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
              babelLoaderOptions
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
        include: [
          //
        ],
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        include: [
          //
        ],
        use: [
          babelLoaderOptions
        ]
      },
      {
        test: /\.jsx$/,
        include: [
          //
        ],
        use: [
          babelLoaderOptions
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
