const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack') // 加

const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

module.exports = {
  entry: './src/load.js',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, '../../public')
    },
    proxy: [
      {
        context: ['/api', '/avatar', '/avatar.svg', '/docs'],
        target: 'http://localhost'
      }
    ],
    hot: true,
    compress: true,
    port: 9000
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      title: 'Output Management'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx']
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }], '@babel/react'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        // test: /\.svg$/,
        include: [
          /icons/
        ],
        use: [
          '@svgr/webpack'
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.zip$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.less$/i,
        exclude: [/node_modules/, /\.module\.less$/], // 排除已匹配的 module 文件
        use: [
          styleLoader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.module\.less$/, // 匹配带 module 后缀的 Less 文件
        exclude: /node_modules/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 自定义类名格式（开发环境易调试）
                localIdentName: isProduction
                  ? '[hash:base64:8]'
                  : '[name]__[local]--[hash:base64:5]'
              },
              importLoaders: 1
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  externals: {
    react: 'React',
    // 'bootstrap-icons': 'BootStrapIcons',
    'react-dom': 'ReactDOM',
    '@douyinfe/semi-ui': 'SemiUI'
  }
}
