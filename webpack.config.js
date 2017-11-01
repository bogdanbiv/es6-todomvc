const webpack = require('webpack')
const {resolve} = require('path')
module.exports = env => {
  const addPlugin = (add, plugin) => (add ? plugin : undefined)
  const ifProd = plugin => addPlugin(env.prod, plugin)
  const removeEmpty = array => array.filter(i => !!i)
  return {
    entry: './js/app.js',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'eval',
    bail: env.prod,
    resolveLoader: {
      moduleExtensions: ["-loader"]
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader!eslint',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css'
        },
      ],
    },
    plugins: removeEmpty([
      // ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      })),
      ifProd(new webpack.DefinePlugin({
        NODE_ENV: '"production"'
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        }
      }))
    ]),
  }
}
