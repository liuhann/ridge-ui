module.exports = {
  externals: [
    {
      module: 'react',
      root: 'React',
      dist: 'react@18.3.1/umd/react.production.min.js'
    },
    {
      module: 'react-dom',
      dependencies: ['react'],
      root: 'ReactDOM',
      dist: 'react-dom@18.3.1/umd/react-dom.production.min.js'
    },
    {
      module: 'vue',
      root: 'Vue',
      dist: 'vue/dist/vue.min.js'
    },
    {
      module: 'ridgejs',
      root: 'RidgeCore'
    },
    {
      module: 'ridgejs-editor',
      root: 'RidgeEditor'
    }
  ]
}
