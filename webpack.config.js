const path = require('path');
const webpack = require('webpack');
const packagejson = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

    mode: 'production',
    // mode: 'development',
    entry: './src/simple-timeline.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'simple-timeline.js',
        library: 'SimpleTimeline',
        libraryExport: 'default',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                // to ES5
                                "@babel/preset-env",
                            ],
                        },
                    }
                ],
            },
            {
                test: /\.(sass|less|css|scss)$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    },
                    'sass-loader'
                ]
            },
        ]
    },
    externals: {
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'simple-timeline.css',
        }),
        new webpack.BannerPlugin({
            banner: `${packagejson.name} v${packagejson.version} | ${packagejson.author.name} | license: ${packagejson.license}`
        })
    ]
};