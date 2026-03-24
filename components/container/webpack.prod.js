const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ridge-containers.umd.min.js',
    library: {
      name: 'RidgeContainers',
      type: 'umd'
    },
    globalObject: 'this',
    clean: true // 自动清空 dist
  },
  plugins: [
    new BundleAnalyzerPlugin({
      statsOptions: {
        source: true, // 确保包含源代码相关信息，这样有助于分析src目录下代码模块情况
        module: true, // 包含模块信息，对于分析src里各个模块在最终打包中的情况很有帮助
        chunks: true, // 包含代码块相关信息，能体现src代码如何划分到不同的块中
        chunkModules: true // 针对代码块中的模块信息，方便知晓src里的模块归属
      }
    })
  ]
})
