var path = require('path');
var webpack = require('webpack');
var buildPath = path.resolve("./src/public/scripts");

var mainPath = path.resolve(__dirname, 'app', 'main.js');

 
module.exports = {
    entry: './src/public/scripts/main.js',
    output: { 
                path: buildPath, 
                filename: 'bundle.js',
                publicPath: '/scripts/'
            },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },


    devServer: {
            //https://github.com/chimurai/http-proxy-middleware
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    secure: false
            }
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devtool: 'source-map',

};