const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    devtool: 'inline-source-map',
    entry: {
      main: './src/main/index.js'
    },
    output: {
      path: path.join(__dirname, 'build/browser'),
      filename: '[name].js'
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
    devtool: 'inline-source-map',
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
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json']
    },
    target: 'electron-renderer'
  },
  {
    devtool: 'inline-source-map',
    entry: {
      index: './src/renderer/index.html',
      style: './src/renderer/sass/main.scss'
    },
    output: {
      path: path.join(__dirname, 'build/renderer'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: "file-loader?name=[name].[ext]"
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("css/[name].css")
    ]
  }
];
