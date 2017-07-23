var path = require('path');

module.exports = {
  entry: {
    'index': './demos/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, "demos/dist"),
    filename: '[name].js'
  },
  externals: ['rxjs'],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: [
              'babel-loader'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, './demos')
        ],
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.jsx$/,
        include: [
          path.resolve(__dirname, './demos')
        ],
        use: [
          'babel-loader'
        ]
      },
    ]
  }
}
