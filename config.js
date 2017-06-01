// global webpack config used for swim projects
var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

// webpack plugins
var BowerWebpackPlugin = require('bower-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var GenerateJsonPlugin = require('generate-json-webpack-plugin');
var projectPackage = require(global.cwd + '/package.json');
var packageJSON = require('./package.json');
var staticPath = global.cwd + '/assets';

var plugins = [];
var copypaths = [];
var externalConfig = false;

// copy paths for moving files into build directory
if (fs.existsSync(staticPath)) {
    copypaths.push({
        from: 'assets',
        to: 'assets'
    });
}


/*    copypaths.push({
        from: __dirname + '/build/assets',
        to: 'assets'
    });*/
    
    copypaths.push({
        from: __dirname + '/build/*.js',
        to: 'assets',
        flatten: true
    });
    
// add copy plugin
// todo: ensure paths in copypaths are not using
// other plugins like base64
plugins.push(new CopyWebpackPlugin(copypaths));

if(projectPackage.config) {
    plugins.push(new GenerateJsonPlugin('assets/config.json', projectPackage.config));
    externalConfig = true;
}

module.exports = {

    // set the context to that of the app we are building
    context: global.cwd,

    // for now we set one entry for the main package.json entry
    entry: {
        // app: ['./' + (projectPackage.swimMain || projectPackage.main)]
        app: [__dirname + '/lib/bootstrap.js']
    },

    // default to build and app.min.js for now
    output: {
        path: cwd + '/build/',
        filename: "assets/[name].min.js"
    },

    // ensure we resolve loaders in our dev tool, and not just in the project
    resolveLoader: {
        modulesDirectories: [
            __dirname + '/node_modules',
            global.cwd + '/node_modules'
        ]
    },

    // resolve files
    // we reference a bunch of files in the build tool
    // command dir is the project path
    resolve: {
        extensions: ['', '.js', '.css'],
        modules: [__dirname + '/node_modules', global.cwd + '/node_modules'],
        alias: {
            'xtag': __dirname + '/node_modules/x-tag',
            'jquery': __dirname + '/node_modules/jquery',
            'swim': __dirname + '/node_modules/swim-client-js',
            'recon': __dirname + '/node_modules/recon-js',
            '_': __dirname + '/node_modules/lodash',
            'router': __dirname + '/lib/router.js',
            'dispatcher': __dirname + '/lib/dispatcher.js',
            'tag': __dirname + '/lib/tag.js',
            'material': __dirname + '/lib/material.js',
            'swimModule': __dirname + '/lib/module.js',
            'script': __dirname + '/node_modules/scriptjs',
            'dialogPolyfill': __dirname + '/node_modules/dialog-polyfill',
            'font-awesome': __dirname + '/lib/font-awesome.less',
            'components': global.cwd + '/components',
            'store': global.cwd + '/store',
            'styles': global.cwd + '/styles',
            'Store': __dirname + '/lib/store.js',
            'moment': __dirname + '/node_modules/moment',
            'Draw': __dirname + '/lib/draw.js',
            'Lawnchair': __dirname + '/node_modules/lawnchair',
            'baseApp': global.cwd + '/index.js',
            'uicore': __dirname + '/node_modules/swim-ui-core',
            'd3': __dirname + '/node_modules/d3',
            'utis': __dirname + '/lib/utils.js',
            'c3': __dirname + '/lib/c3.js',
            'chance': __dirname + '/node_modules/chance',
            'debug': __dirname + '/lib/debug.js',
            'odometer': __dirname + '/lib/odometer.js'
        }
    },

    // we need source maps
    devtool: "source-map",


    module: {
        // we're sending all these loaders with this one dev tool install
        loaders: [{
                test: /\.(jpg|svg|png|gif|jpeg)$/,
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
                test: /\.(html)$/,
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
                test: /\.(scss|sass)$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file?name=assets/fonts/[name].[ext]',
                exclude: /components/
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [__dirname + '/node_modules/babel-preset-es2015']
                }
            }
        ],
    },

    // plugins to help run our dev tool
    plugins: [

        // provide accessables to modules
        new webpack.DefinePlugin({
            'app': JSON.stringify({
                package: packageJSON,
                debug: global.debug,
                externalConfig: externalConfig
            })
        }),

        // provide modules directly to modules no requires needed
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Swim: 'swim',
            Recon: 'recon',
            _: '_',
            tag: 'tag',
            __material__: 'material',
            __swimModule__: 'swimModule',
            __fontawesome__: 'font-awesome',
            Router: 'router',
            Script: 'script',
            dialogPolyfill: 'dialogPolyfill',
            Store: 'Store',
            Dispatcher: 'dispatcher',
            moment: 'moment',
            Draw: 'Draw',
            Lawnchair: 'Lawnchair',
            d3: 'd3',
            c3: 'c3',
            debug: 'debug'
        }),

        // generate an index.html for the app
        new HtmlWebpackPlugin({
            // Required
            inject: false,
            appMountId: 'app',
            title: projectPackage.title || 'My App',
            mobile: true,
            template: require('html-webpack-template'),
            scripts: [
                'assets/swim.platform.js'
            ],
            links: ['https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i,700,700i,900,900i']
        }),

        // package bower scripts
        new BowerWebpackPlugin({
            modulesDirectories: ["bower_components"],
            manifestFiles: "bower.json",
            includes: /.*/,
            excludes: [],
            searchResolveModulesDirectories: true
        }),

        // split out framework from app code, faster dev refreshed on HMR
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app.commons',
            minChunks: function(module) {
                // this assumes your vendor imports exist in the node_modules or lib directory
                return module.context && (module.context.indexOf('node_modules') !== -1 || module.context.indexOf('lib') !== -1);
            }
        }),
        
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(__dirname + '/build/platform-manifest.json'),
        })
  
    ].concat(plugins),
};