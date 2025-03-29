import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  apps : [{
    script: './dist/src/app.js',
    name: 'challengezone',
    env_production: {
      NODE_ENV: "production"
    }
  }],
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]

}