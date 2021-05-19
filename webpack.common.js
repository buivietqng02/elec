const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlPageNames = ['index', 'login', 'meeting'];
const multipleHtmlPlugins = htmlPageNames.map(name => new HtmlWebpackPlugin({
    cache: false,
    template: `html/${name}.html`,
    filename: `../${name}.html`,
    chunks: [name]
}));

module.exports = {
    entry: {
        index: ['babel-polyfill', './app/router.js'],
        meeting: './app/meeting.js',
        login: './assets/js/login.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'source'),
        publicPath: '/source/'
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new MiniCssExtractPlugin(),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jsrender: 'jsrender'
        })
    ].concat(multipleHtmlPlugins),
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'app'),
            features: path.resolve(__dirname, 'app/features'),
            shared: path.resolve(__dirname, 'app/shared'),
            assets: path.resolve(__dirname, 'assets')
        },
        extensions: ['*', '.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader']
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '/source'
                        }
                    }
                ]
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            }
        ]
    }
};
