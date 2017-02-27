#! /usr/bin/env node

global.cwd = process.cwd();

// node modules to run this tools
var fs = require('fs');
var path = require('path');
var blargs = require('blargs').default;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

// todo: check if package.json exists, we need to setup an
// init command path anyway
// project files we need to know about
var projectPackage;

try {
    projectPackage = require(cwd + '/package.json');
} catch (e) {

}

// capture some stuff about our command environment from the CLI
var ret = blargs();
var args = ret[0];

// build a swim project
if (args.build === true) {

    // global webpack config used for swim projects
    var globalConfig = require('./config');

    // build the swim-project
    console.log('\uD83D\uDD28 Bundling SWIM Project...');

    if (!projectPackage) {
        console.log('no package.json found!');
        return;
    }

    globalConfig.plugins.push(new webpack.optimize.DedupePlugin());
    globalConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    globalConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        sourcemap: true
    }));

    webpack(globalConfig, function (err, stats) {
        if (err) return handleError(err);
        console.log('\u2713 Build Finished...', globalConfig.output.path);
    });
}

// dev server for a swim project
if (args.serve === true || args.nwjs === true) {
    var config = require('./config');
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

    if (projectPackage) {
        // package.json was found, offer use the ability to scaffold component
        return;
    }


    // otherwise user can  create a project
    var prompt = require('prompt');

    prompt.message = "SWIM";

    var properties = [{
        name: 'project-name',
        validator: /^[a-zA-Z\-]+$/,
        warning: 'name must be only letters, or dashes'
    }];

    prompt.start();

    prompt.get(properties, function (err, result) {
        if (err) {
            return onErr(err);
        }
        console.log('Command-line input received:');
        console.log('  Username: ' + result['project-name']);
    });

    function onErr(err) {
        console.log(err);
        return 1;
    }
}