#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var blargs = require('blargs').default;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ret = blargs();
var args = ret[0];
var positionals = ret[1];
var next = ret[2];
var cwd = process.cwd();
var projectPackage = require(cwd + '/package.json');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


// global webpack config used for swim projects
var globalConfig = {

    // set the context to that of the app we are building
    context: cwd,

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

    // we need source maps
    devtool: "source-map",
    module: {
        // we're sending all these loaders with this one dev tool install
        loaders: [{
                test: /\.json$/,
                loader: "json",
                include: cwd
            }, {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                loader: 'html',
                query: {
                    minimize: true
                }
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ],
    },
    // plugins to help run our dev tool
    plugins: [
        new HtmlWebpackPlugin(),
        new BowerWebpackPlugin({
            modulesDirectories: ["bower_components"],
            manifestFiles: "bower.json",
            includes: /.*/,
            excludes: [],
            searchResolveModulesDirectories: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            sourcemap: true
        }),
    ],


};

// build a swim project
if (args.build === true) {
    // build the swim-project
    console.log('Bundling SWIM Project...');

    if (!projectPackage) {
        console.log('no package.json found!');
        return;
    }

    webpack(globalConfig, function (err, stats) {
        if (err) return handleError(err);
        console.log('Build Finished...');
    });
}

// dev server for a swim project
if (args.serve === true) {
    var config = globalConfig;
    config.entry.app.unshift(__dirname + "/node_modules/webpack-dev-server/client?http://localhost:8080/", __dirname + "/node_modules/webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler, {
        hot: true,
        contentBase: cwd + "/build",
        compress: false,
        port: 9000,
        // stats: 'errors-only'
    });

    server.listen(8080);

    console.log('now serving on port 8080 http://127.0.0.1:8080');
}

// init a swim project? 
if (args.init === true) {

}