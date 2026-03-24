const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ridge-containers.umd.js',
    library: {
      name: 'RidgeContainers',
      type: 'umd'
    },
    globalObject: 'this'
  },
  watch: true
})
