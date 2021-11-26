const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack 搭建 react 项目',
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new friendlyErrorsWebpackPlugin()
  ]
}
