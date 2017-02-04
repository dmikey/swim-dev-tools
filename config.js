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
    copypaths.push({ from: 'assets', to:'assets' });
} 

plugins.push(new CopyWebpackPlugin(copypaths));


module.exports = {

    // set the context to that of the app we are building
    context: global.cwd,

    // for now we set one entry for the main package.json entry
    entry: {
        app: ['./' + (projectPackage.swimMain || projectPackage.main)],
        test: global.cwd + '/components/swim-map/index.js'
    },

    // default to build and app.min.js for now
    output: {
        path: cwd + '/build/',
        filename: "[name].min.js"
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
        alias: (function(){

            var projectComponentsPath = global.cwd + '/components';
        
            var aliasRet = {
                xtag: __dirname + '/node_modules/x-tag',
                jquery: __dirname + '/node_modules/jquery',
                swim: __dirname + '/node_modules/swim-client-js',
                _: __dirname + '/node_modules/lodash',
                router: __dirname + '/router.js',
                store: __dirname + '/store.js',
                tag: __dirname + '/tag.js',
                material: __dirname + '/material.js',
                swimModule: __dirname + '/module.js',
                script: __dirname + '/node_modules/scriptjs'
            }

            // alias anything that is in the components directory
            // todo increase dyanmic aliases, for views etc
            if (fs.existsSync(projectComponentsPath)) {
                    function parseComponents(nodes, parent) {
 
                        if(parent && nodes.indexOf('index.js') > -1)
                            aliasRet['components/' + parent] = global.cwd + '/components/' + parent + '/index.js';
                        else
                            nodes.forEach(function(node) {
                                var path = projectComponentsPath + '/' +(parent ? parent+'/' : '')+node;
                                if(fs.statSync(path).isDirectory())
                                    parseComponents(fs.readdirSync(path), (parent ? parent+'/' : '')+node);
                            });
                    }
                   
                    parseComponents(fs.readdirSync(projectComponentsPath));
            } 

            return aliasRet;

        }())
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
                loaders:  ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=assets/fonts/[name].[ext]'
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
            tag: 'tag',
            template: 'template',
            __material__: 'material',
            __swimModule__: 'swimModule',
            Router: 'router',
            Script: 'script'
        }),
        new HtmlWebpackPlugin({
             // Required
               inject: false,
               appMountId: 'app',
               title: projectPackage.title || 'My App',
               mobile: true,
               template: require('html-webpack-template'),
                links: [
                    'https://fonts.googleapis.com/css?family=Roboto'
                ]
        }),
        new BowerWebpackPlugin({
            modulesDirectories: ["bower_components"],
            manifestFiles: "bower.json",
            includes: /.*/,
            excludes: [],
            searchResolveModulesDirectories: true
        })
    ].concat(plugins),
};