/* eslint-disable @typescript-eslint/no-var-requires */
const npath = require('path')
const pkg = require('../package.json')
const h5Chain = require('./webpack/h5Chain')

function getVersion() {
  function fillZero(value) {
    return value < 10 ? `0${value}` : `${value}`
  }
  const date = new Date()

  return `${date.getFullYear() - 2010}.${date.getMonth()}${fillZero(
    date.getDay(),
  )}.${date.getHours()}${fillZero(date.getMinutes())}`
}

const version = getVersion()
console.log(version)

const config = {
  projectName: pkg.name,
  date: '2022-3-14',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'build',
  env: {
    API_ENV: JSON.stringify(process.env.API_ENV),
    WATCHING: JSON.stringify(process.env.WATCHING || 'false'),
    DEPLOY_VERSION: JSON.stringify(version),
  },
  alias: {
    '@babel/runtime-corejs3/regenerator': npath.resolve(
      process.cwd(),
      './node_modules/regenerator-runtime',
    ),
    '@babel/runtime/regenerator': npath.resolve(
      process.cwd(),
      './node_modules/regenerator-runtime',
    ),
    '@': npath.resolve(process.cwd(), 'src'),
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  compiler: {
    type: 'webpack5',
    prebundle: {
      // 暂时不要开启，开启会报错
      enable: false,
    },
  },
  framework: 'react',
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  h5: {
    webpackChain(chain) {
      const publicPath = process.env.PUBLIC_PATH || '/'
      h5Chain(chain)
      if (process.env.NODE_ENV === 'production') {
        chain.mode('production')
        chain.devtool('hidden-source-map')
        chain.output
          .path(npath.resolve('./build'))
          .filename('assets/js/[name]_[hash].js')
          .chunkFilename('assets/js/chunk/[name]_[hash].js')
          .publicPath(publicPath.replace('VERSION', version))
      } else {
        chain.mode('development')
        chain.devtool('eval-cheap-module-source-map')
        chain.output
          .path(npath.resolve('./build'))
          .filename('assets/js/[name]_[hash].js')
          .chunkFilename('assets/js/chunk/[name]_[hash].js')
          .publicPath(publicPath.replace('VERSION', version))
      }
      if (process.env.WATCHING === 'true') {
        chain.output.publicPath(`/`)
      }
    },
    lessLoaderOption: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${npath.join(
            process.cwd(),
            'src/styles/index.less',
          )}";`,
        },
      },
    },
    router: {
      mode: 'browser',
    },
    devServer: {
      port: 10086,
      hot: false,
      host: '0.0.0.0',
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // 表示允许跨域
      },
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      pxtransform: {
        enable: false,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: false,
      filename: 'assets/css/[name]_[hash].css',
      chunkFilename: 'assets/css/chunk/[name]_[hash].css',
    },
  },
  plugins: [],
}

module.exports = function (merge) {
  return merge({}, config, require(`./${process.env.NODE_ENV}`))
}
