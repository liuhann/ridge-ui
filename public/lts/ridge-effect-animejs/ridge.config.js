module.exports = {
  localNpmDir: '../../public/npm',
  configureWebpack: {
    externals: {
      '@douyinfe/semi-ui': 'SemiUI',
      '@douyinfe/semi-icons': 'SemiIcons'
    }
  }
}
