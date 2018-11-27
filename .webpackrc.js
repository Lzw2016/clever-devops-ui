const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ['react-intl', { messagesDir: './i18n-messages', enforceDescriptions: false, extractSourceLocation: false }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  // outputPath -  设置打包路径
  // outputPath: 'C:/Users/lzw/Desktop/jztSource/yvan-periscope/yvan-periscope/src/main/resources/static',
  proxy: {
    '/api': {
      target: 'http://localhost:28081/',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
    '/ws': {
      target: 'http://localhost:28081/',
      ws: true,
      pathRewrite: { "^/ws": "/ws" }
    },
  },
};
