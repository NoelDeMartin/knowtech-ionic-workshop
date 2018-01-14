const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ClearPlugin = require('clean-webpack-plugin');

module.exports = {

    entry: {
        app: [
            './src/main.ts',
            './src/app/app.scss'
        ]
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },

    module: {

        rules: [

            {
                test: /\.tsx?$/,
                use: [ 'ts-loader', 'angular2-template-loader' ],
                exclude: /node_modules/
            },

            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    removeAttributeQuotes: false,
                    keepClosingSlash: true,
                    caseSensitive: true,
                    conservativeCollapse: true,
                }
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                }),
                exclude: path.resolve(__dirname, 'src/components')
            },

            {
                test: /\.scss$/,
                use: ['raw-loader', 'sass-loader'],
                include: path.resolve(__dirname, 'src/components')
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