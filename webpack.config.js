'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const minimist = require('minimist');
const path = require('path');

const commandline = minimist(process.argv.slice(2));

const pluginsList = [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
];

let devtool;
if (commandline.env === 'production') {
    pluginsList.push(new BabiliPlugin());
    pluginsList.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }));
} else {
    pluginsList.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"development"' } }));
    devtool = 'source-map';
}

module.exports = {
    entry: {
        main: ['./src/renderer/main.js'],
        web:  ['./src/web/main.js']
    },
    target: 'electron',
    output: {
        path: './src/dist',
        filename: '[name].entry.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: [
                    path.resolve(__dirname, 'node_modules/react-popover-wrapper'),
                ],
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ use: 'css-loader' })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }],
            },
            {
                test: /\.(png|jpg)([?]?.*)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: ['svg-inline-loader'],
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/svg+xml'
                    }
                }],
                include: /node_modules/
            }
        ]
    },
    plugins: pluginsList,
    devtool
};
