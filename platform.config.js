var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    swim: [
        './node_modules/x-tag',
        './node_modules/lodash',
        './node_modules/jquery',
        './node_modules/swim-client-js',
        './node_modules/recon-js',
        './node_modules/scriptjs',
        './node_modules/dialog-polyfill',
        './node_modules/moment',
        './node_modules/lawnchair',
        './node_modules/d3',
        './node_modules/swim-ui-core/mdl-progress-bar',
        './node_modules/swim-ui-core/swim-chart-tooltip',
        './node_modules/swim-ui-core/swim-donut-chart',
        './node_modules/swim-ui-core/swim-left-nav',
        './node_modules/swim-ui-core/swim-line-chart',
        './node_modules/swim-ui-core/swim-sankey', 
        './node_modules/swim-ui-core/swim-step-chart',
        './lib/debug',
        './lib/c3',
        './lib/dispatcher', 
        './lib/module',
        './lib/odometer',
        './lib/router',
        './lib/store',
        './lib/tag',
        './lib/utils'
    ],
  },
  output: {
    filename: '[name].platform.js',
    path: path.resolve(__dirname, 'build'),
    library: 'swim_platform',
  },
  resolve: {
        extensions: ['', '.js', '.css'],
        modules: [__dirname + '/node_modules'],
        alias: {
            'xtag': __dirname + '/node_modules/x-tag',
            'jquery': __dirname + '/node_modules/jquery',
            'swim': __dirname + '/node_modules/swim-client-js',
            'recon': __dirname + '/node_modules/recon-js',
            '_': __dirname + '/node_modules/lodash',
            'router': __dirname + '/lib/router.js',
            'dispatcher': __dirname + '/lib/dispatcher.js',
            'tag': __dirname + '/lib/tag.js',
            'swimModule': __dirname + '/lib/module.js',
            'script': __dirname + '/node_modules/scriptjs',
            'dialogPolyfill': __dirname + '/node_modules/dialog-polyfill',
            'font-awesome': __dirname + '/lib/font-awesome.less',
            'components': global.cwd + '/components',
            'store': global.cwd + '/store',
            'Store': __dirname + '/lib/store.js',
            'moment': __dirname + '/node_modules/moment',
            'Draw': __dirname + '/lib/draw.js',
            'Lawnchair': __dirname + '/node_modules/lawnchair',
            'baseApp': global.cwd + '/index.js',
            'uicore': __dirname + '/node_modules/swim-ui-core',
            'd3': __dirname + '/node_modules/d3',
            'utis': __dirname + '/lib/utils.js',
            'c3': __dirname + '/lib/c3.js',
            'edge': __dirname + '/lib/edge.js',
            'chance': __dirname + '/node_modules/chance',
            'debug': __dirname + '/lib/debug.js',
            'odometer': __dirname + '/lib/odometer.js'
        }
    },
     
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
                test: /\.(scss|sass)$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file?name=assets/fonts/[name].[ext]'
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
    plugins: [
      new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Swim: 'swim',
            Recon: 'recon',
            _: '_',
            tag: 'tag',
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
  new webpack.DllPlugin({
    name: 'swim_platform',
    path: __dirname + '/build/platform-manifest.json',
  })]
};