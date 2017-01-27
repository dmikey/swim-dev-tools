// global webpack config used for swim projects


var webpack = require('webpack');
var fs = require('fs');


// webpack plugins
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var projectPackage = require(global.cwd + '/package.json');
var staticPath = global.cwd + '/static';

var plugins = [];
if (fs.existsSync(staticPath)) {
    plugins.push(new CopyWebpackPlugin([
        { from: 'static', to:'static' }
    ]));
}

module.exports = {

    // set the context to that of the app we are building
    context: global.cwd,

    // for now we set one entry for the main package.json entry
    entry: {
        app: ['./' + projectPackage.main]
    },

    // default to build and app.min.js for now
    output: {
        path: cwd + '/build/',
        filename: "app.min.js"
    },

    // ensure we resolve loaders in our dev tool, and not just in the project
    resolveLoader: {
        modulesDirectories: [
            __dirname + '/node_modules'
        ]
    },

    resolve: {
        extensions: ['','.js', '.css'],
        modules: [__dirname + '/node_modules', 'node_modules'],
        alias: {
            xtag: __dirname + '/node_modules/x-tag',
            jquery: __dirname + '/node_modules/jquery',
            swim: __dirname + '/node_modules/swim-client-js',
            _: __dirname + '/node_modules/lodash'
        }
    },

    // we need source maps
    devtool: "source-map",
    module: {
        // we're sending all these loaders with this one dev tool install
        loaders: [{
                test: /\.(jpg|png|gif|jpeg)$/,
                loader: "base64-image-loader"
            },
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(html|svg)$/,
                loader: 'html',
                query: {
                    minimize: true
                }
            },
            {
                test: /\.less$/,
                loaders:  ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ],
    },
    
    // plugins to help run our dev tool
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Swim: 'swim',
            _:'_',
            xtag: 'xtag'
        }),
        new HtmlWebpackPlugin(),
        new BowerWebpackPlugin({
            modulesDirectories: ["bower_components"],
            manifestFiles: "bower.json",
            includes: /.*/,
            excludes: [],
            searchResolveModulesDirectories: true
        })
    ].concat(plugins),
};