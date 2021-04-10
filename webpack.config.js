/*jshint esversion: 6 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
      "index": "./src/index",
      "file_index": "./src/file_index",
      "file": "./src/file"
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            minSize: 100000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            },
            chunks: 'all'
        }
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    mode: 'production',
    module: {
      rules: [
        {
            test: /\.html$/i,
            loader: 'html-loader'
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
      ]
    }
};