const path = require('path')
const resolve = dir => path.join(__dirname, './', dir)
module.exports = {
  publicPath: '/sa-ui/',
  outputDir: resolve('lib'),
  
  pages: {
    index: {
      entry: resolve('examples/main.tsx'),
      template: 'public/index.html',
      filename: 'index.html',
      title: 'sa-ui@1.0.0beta',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },

  css: {
    sourceMap: false,
    loaderOptions: {
        sass: {
            prependData: `@import "src/style/global-import.scss";`
        }
    }
  },
  
  chainWebpack: config => {
    config.plugins
        .delete('prefetch-index')
        .delete('preload-index')

    config
        .plugin('html-index')
        .tap((args) => {
            args[0].chunksSortMode = 'manual'
            return args
        })

    config.resolve.alias
        .set('examples', resolve('examples'))
        .set('src', resolve('src'))
        .set('sa-ui', resolve('src'))

    const fontRule = config.module.rule('fonts')
    fontRule.uses.clear()
    fontRule
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use('url')
        .loader('url-loader')
        .options({
            limit: 4096,
            fallback: {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        })
},
}