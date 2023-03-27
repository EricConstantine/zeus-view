/* 配置文件 */
const path = require('path')
const WebpackBar = require('webpackbar')
const TerserPlugin = require('terser-webpack-plugin')

const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  productionSourceMap,
  title,
  devServer
} = require('./src/config/vue.custom.config.ts')

module.exports = {
  publicPath,
  outputDir,
  assetsDir,
  lintOnSave,
  productionSourceMap,
  devServer,
  pluginOptions: {
    electronBuilder: {
      preload: path.join(__dirname, 'src/preload.ts'),
      // 打包参数配置
      builderOptions: {
        productName: "zeus",
        mac: {
          icon: "./public/logo-zeus.ico", //图标路径
        },
        win: {
          icon: "./public/logo-zeus.ico", //图标路径,
          target: [{
            target: 'nsis', // 利用nsis制作安装程序
            'arch': [
              'x64', // 64位
              'ia32'
            ]
          }]
        },
        nsis: {
          oneClick: false, // 一键安装
          perMachine: true, // 是否开启安装时权限限制（此电脑或当前用户）
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: "./public/logo-zeus.ico", // 安装图标
          uninstallerIcon: "./public/logo-zeus.ico", //卸载图标
          installerHeaderIcon: "./public/logo-zeus.ico", // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: "zeus", // 图标名称
        }
      }
    },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/variables.scss'),
        path.resolve(__dirname, 'src/styles/mixins.scss'),
      ]
    }
  },
  configureWebpack: () => {
    const config = {
      name: title // 可以在 index.html 中被访问，用来注入页面标题
    }
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [
        new WebpackBar({
          name: title
        })
      ],
        // 生产环境清除 console.log
        config.optimization = {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                mangle: true,
                compress: {
                  warnings: false,
                  drop_console: false,
                  drop_debugger: false,
                  pure_funcs: ['console.log'] // 清除 console.log
                },
                output: {
                  comments: false // 删除注释
                }
              }
            })
          ]
        }
    }
    return config
  },
  chainWebpack: config => {
    // 当有很多页面时，它会导致太多毫无意义的请求
    config.plugins.delete('prefetch')
    // 开发环境 sourcemap 不包含列信息
    config.when(process.env.NODE_ENV === 'development',
      config => config.devtool('cheap-source-map')
    )
    // svg
    const dir = path.resolve(__dirname, 'src/icons/svg')
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include
      .add(dir)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader').options({extract: false})
      .end()
    config.plugin('svg-sprite')
      .use(require('svg-sprite-loader/plugin')), [{pluginSprite: true}]
    config.module.rule('svg').exclude.add(dir)
    // 将运行代码单独生成文件
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.runtimeChunk('single')
    }
  }
}
