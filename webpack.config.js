const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ClearPlugin = require('clean-webpack-plugin');

module.exports = {

    entry: {
        app: [
            './app.ts',
            './app.scss'
        ]
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },

    module: {

        rules: [

            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },

        ]

    },

    plugins: [
        new ClearPlugin(['build'], {
            dist: __dirname,
            verbose: true,
            dry: false,
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ],

    resolve: {
        extensions: ['*', '.js', '.ts'],
    }

};