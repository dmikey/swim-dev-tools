// global webpack config used for swim projects
var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

// webpack plugins
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var projectPackage = require(global.cwd + '/package.json');
var staticPath = global.cwd + '/assets';

var plugins = [];
var copypaths = [];

if (fs.existsSync(staticPath)) {
    copypaths.push({
        from: 'assets',
        to: 'assets'
    });
}

plugins.push(new CopyWebpackPlugin(copypaths));


module.exports = {

    // set the context to that of the app we are building
    context: global.cwd,

    // for now we set one entry for the main package.json entry
    entry: {
        app: ['./' + (projectPackage.swimMain || projectPackage.main)]
    },

    // default to build and app.min.js for now
    output: {
        path: cwd + '/build/',
        filename: "[name].js"
    },

    // ensure we resolve loaders in our dev tool, and not just in the project
    resolveLoader: {
        modulesDirectories: [
            __dirname + '/node_modules',
            global.cwd + '/node_modules'
        ]
    },

    resolve: {
        extensions: ['', '.js', '.css'],
        modules: [__dirname + '/node_modules', global.cwd + '/node_modules'],
        alias: {
            xtag: __dirname + '/node_modules/x-tag',
            jquery: __dirname + '/node_modules/jquery',
            swim: __dirname + '/node_modules/swim-client-js',
            recon: __dirname + '/node_modules/recon-js',
            _: __dirname + '/node_modules/lodash',
            router: __dirname + '/router.js',
            dispatcher: __dirname + '/dispatcher.js',
            tag: __dirname + '/tag.js',
            material: __dirname + '/material.js',
            swimModule: __dirname + '/module.js',
            script: __dirname + '/node_modules/scriptjs',
            dialogPolyfill: __dirname + '/node_modules/dialog-polyfill',
            'jquery-ui': __dirname + '/node_modules/jquery-ui',
            'font-awesome': __dirname + '/fontawesome.js',
            'components': global.cwd + '/components',
            'store': global.cwd + '/store'
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
                loaders: ['style-loader', 'css-loader']
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
                loaders: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=assets/fonts/[name].[ext]'
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets:[__dirname + '/node_modules/babel-preset-es2015']
                }
            }
        ],
    },

    // plugins to help run our dev tool
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Swim: 'swim',
            Recon: 'recon',
            _: '_',
            tag: 'tag',
            template: 'template',
            __material__: 'material',
            __swimModule__: 'swimModule',
            __fontawesome__: 'font-awesome',
            Router: 'router',
            Script: 'script',
            dialogPolyfill: 'dialogPolyfill'
        }),
        new HtmlWebpackPlugin({
            // Required
            inject: false,
            appMountId: 'app',
            title: projectPackage.title || 'My App',
            mobile: true,
            template: require('html-webpack-template')
        }),
        new BowerWebpackPlugin({
            modulesDirectories: ["bower_components"],
            manifestFiles: "bower.json",
            includes: /.*/,
            excludes: [],
            searchResolveModulesDirectories: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'swim.platform',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ].concat(plugins),
};