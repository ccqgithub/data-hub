var path = require('path');

module.exports = {
  entry: {
    'index': './index.js'
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'rx-hub.js',
    library: 'rx-hub',
    libraryTarget: 'umd',
  },

  target:'web',
  externals: ['rxjs'],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, './'),
        ],
        exclude: [
          path.resolve(__dirname, './node_modules'),
        ],
        use: [
          'babel-loader'
        ]
      }
    ]
  }
}
