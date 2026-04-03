const path = require('path')
const fs = require('fs') // 加这个
const pkg = require('./package.json')

// const svgToMiniDataURI = require('mini-svg-data-uri');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const distpath = path.resolve(__dirname, './dist')
console.log('distPath', distpath)

if (!fs.existsSync(distpath)) {
  fs.mkdirSync(distpath, { recursive: true })
}
const copyFiles = pkg.files || []

console.log('copyFiles', copyFiles)
module.exports = {
  entry: './src/index.js',
  output: {
    path: distpath,
    filename: 'ridge-container.umd.min.js',
    library: {
      name: 'RidgeContainer',
      type: 'umd'
      // export: 'default'
    },
    globalObject: 'this'
    // clean: true
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              browsers: [
                '> 0.2%', // 市场份额大于 0.2% 的浏览器
                'last 2 versions', // 每个浏览器最近 2 个版本
                'not dead' // 还在维护的浏览器
              ]
            }
          }], '@babel/preset-react'],
          plugins: []
        }
      }]
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: { allowTsInNodeModules: true }
      }]
    }, {
      test: /\.s[ac]ss$/i,
      use: [{
        loader: 'style-loader' // 将 JS 字符串生成为 style 节点
      }, {
        loader: 'css-loader' //  将 CSS 转化成 CommonJS 模块
      }, {
        loader: 'scoped-css-loader'
      },
      {
        loader: 'sass-loader' // 将 Sass 编译成 CSS
      }]
    }, {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader' // creates style nodes from JS strings
        },
        {
          loader: 'css-loader' // translates CSS into CommonJS
        },
        {
          loader: 'less-loader' // compiles Less to CSS
        }
      ]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpg|gif)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 3145728
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name][ext][query]'
      }
    }, {
      test: /\.svg$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 3145728
        }
      }],
      resourceQuery: { not: [/inline/] } // exclude *.svg?inline
    },
    {
      test: /\.svg$/i,
      resourceQuery: /inline/, // *.svg?inline
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgo: false
        }
      }]
    },
    {
      test: /\.mp3$/,
      type: 'asset', // 使用内置的 asset 模块
      parser: {
        dataUrlCondition: {
          maxSize: 50 * 1024 // 50 KB
        }
      },
      generator: {
        filename: 'audio/[name][ext]' // 大于 50KB 的文件输出路径
      }
    }]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.vue']
  },
  externals: {
    react: 'React',
    debug: 'debug',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: copyFiles.map((item) => ({
        from: path.resolve(__dirname, item),
        to: path.resolve(__dirname, '../../public/npm/ridge-container/', item)
      }))
    })
  ]
}
