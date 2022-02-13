const path = require('path');
const webpack = require('webpack');
const packagejson = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

var config = {

    mode: 'production',
    // mode: 'development',
    entry: {
        'simple-timeline': './src/simple-timeline.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
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
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            include: /\.min\./,
            extractComments: false,
        })],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['.ts', '.js'],
            exclude: 'node_modules'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new webpack.BannerPlugin({
            banner: `${packagejson.name} v${packagejson.version} | ${packagejson.author.name} | license: ${packagejson.license}`
        })
    ]
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.mode = 'development';
        config.entry = {
            'simple-timeline': './src/simple-timeline.js'
        };
    } else {
        config.mode = 'production';
        config.entry = {
            'simple-timeline': './src/simple-timeline.js',
            'simple-timeline.min': './src/simple-timeline.js'
        };

    }

    return config;
};

