const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const pkg = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 读取 package.json → 自动获取 name + version
const packageName = pkg.name
const packageVersion = pkg.version

const targetCopyPath = path.resolve(__dirname, `../../public/npm/${packageName}@${packageVersion}/dist`)

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ridge-container.umd.min.js',
    library: {
      name: 'RidgeContainers',
      type: 'umd',
      export: 'default'
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
    }),
    new CopyPlugin({
      patterns: [
        {
          // 来源：webpack 构建完的输出目录（dist）
          from: path.resolve(__dirname, 'dist'),
          // 目标：包名+版本号目录
          to: targetCopyPath,
          // 开启：覆盖已有文件
          force: true
        }
      ]
    })
  ]
})
