var path = require('path');
var webpack = require('webpack');
 
module.exports = {
    entry: './../src/public/scripts/main.js',
    output: { 
                path: path.resolve("../src/public/scripts"), 
                filename: 'bundle.js' 
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

    devtool: 'source-map',
};