const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: ['./src/js/index.js', "./src/register/register.js", "./src/signIn/signIn.js", "./src/products/products.js", "./src/cart/cart.js"],

  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '',
    filename: 'bundle.js'
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 7000,
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        { test: /\.hbs$/, 
          loader: "handlebars-loader", 
          options: {
            helperDirs: path.join(__dirname, 'modules/helpers'),
            precompileOptions: {
              knownHelpersOnly: false,
            }
          }
        },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
      }),
  
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "static"),
          to: path.resolve(__dirname, "dist", "static"),
          noErrorOnMissing: true
        }
      ]
    }),
  ],
  mode: 'development'
};