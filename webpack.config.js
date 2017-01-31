const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    entry: {
      main: './src/main/index.js'
    },
    output: {
      path: path.join(__dirname, 'build/browser'),
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    target: "electron"
  },
  {
    entry: {
      renderer: './src/renderer/app.js'
    },
    output: {
      path: path.join(__dirname, 'build/renderer'),
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    target: 'electron-renderer'
  },
  {
    entry: {
      index: './src/renderer/index.html',
      style: './src/renderer/sass/main.scss'
    },
    output: {
      path: path.join(__dirname, 'build/renderer'),
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: "file?name=[name].[ext]"
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("css/[name].css")
    ]
  }
];
