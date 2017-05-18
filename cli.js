#! /usr/bin/env node

global.cwd = process.cwd();
global.debug = false;

// node modules to run this tools
var fs = require('fs');
var path = require('path');
var fs = require('fs-extra')
var blargs = require('blargs').default;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var packageJSON = require('./package.json');

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

function main() {

    if (args.version === true) {
        console.log(packageJSON.version);
    }
    
    // init a swim project? 
    if (args.clean === true) {
        console.log('cleaning with js-beautify');
        
        // Run external tool synchronously
        const exec = require('child_process').exec;
        exec(['find . -type f -name "*.js" -exec ' + __dirname + '/node_modules/.bin/js-beautify -r {} \\;'], (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        });

    }
    
   
    // init a swim project? 
    if (args.validate === true) {
        console.log('validating and auto-correcting with standard');
        
        // Run external tool synchronously
        const exec = require('child_process').exec;
        exec(['find . -type f -name "*.js" -not -path "./node_modules/*" -exec ' + __dirname + '/node_modules/.bin/standard {} --fix \\;'], (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        });

    }

    // build a swim project
    if (args.build === true) {

        // global webpack config used for swim projects
        var globalConfig = require('./config');

        console.log('Prepping build workspace.')

        var deleteFolderRecursive = function(path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };

        deleteFolderRecursive(globalConfig.output.path);

        // build the swim-project
        console.log('Bundling SWIM Project');
        console.log('swim-tools version: ', packageJSON.version);
        console.log('webpack version: ', packageJSON.dependencies.webpack)

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

        webpack(globalConfig, function(err, stats) {
            if (err) return handleError(err);

            if (args.archive === true) {
                var zipFolder = require('zip-folder');

                console.log('creating ZIP artifact of project: ', cwd + '/archive.zip');
                zipFolder(globalConfig.output.path, cwd + '/archive.zip', function(err) {
                    if (err) {
                        console.log('oh no!', err);
                    } else {
                        console.log('Build Finished...', globalConfig.output.path);
                    }
                });
            } else {
                console.log('\u2713 Build Finished...', globalConfig.output.path);
            }

        });

        return;
    }

    // dev server for a swim project
    if (args.serve === true || args.nwjs === true) {
        global.debug = true;

        // turn off debug if passed false from args
        if (args.debug == false) {
            global.debug = false;
        }

        var config = require('./config');

        config.entry.app.unshift(__dirname + "/node_modules/webpack-dev-server/client?http://localhost:" + (args.port || 8080),
            __dirname + "/node_modules/webpack/hot/dev-server");

        config.plugins.push(new webpack.HotModuleReplacementPlugin());

        var compiler = webpack(config);

        var server = new WebpackDevServer(compiler, {
            hot: true,
            cache: false,
            contentBase: cwd + "/build",
            compress: false,
            port: 9000,
            overlay: true,
            quiet: true,
            watchContentBase: true
            // stats: 'errors-only'
        });

        server.listen(args.port || 8080);

        console.log('Swim Project Dev Server, serving on port ' + (args.port || 8080) + ' http://127.0.0.1:' + (args.port || 8080));

        return;
    }

    // init a swim project? 
    if (args.init === true) {

        // otherwise user can  create a project
        var prompt = require('prompt');
        prompt.message = "SWIM";


        if (projectPackage) {
            var properties = [{
                name: 'component-name',
                validator: /^[a-zA-Z\-]+$/,
                warning: 'name must be only letters, or dashes'
            }];

            prompt.start();

            prompt.get(properties, function(err, result) {
                if (err) {
                    return onErr(err);
                }

                fs.copy(__dirname + '/project_templates/swim_component', global.cwd + '/components/hello_component', err => {
                    if (err) return console.error(err)
                    console.log("success!")
                });

            });

            // package.json was found, offer use the ability to scaffold component
            return;
        }

        var properties = [{
            name: 'project-name',
            validator: /^[a-zA-Z\-]+$/,
            warning: 'name must be only letters, or dashes'
        }];

        prompt.start();

        prompt.get(properties, function(err, result) {
            if (err) {
                return onErr(err);
            }

            console.log('Creating Project: ', result['project-name']);

            fs.copy(__dirname + '/project_templates/swim_app', global.cwd + '/' + result['project-name'], err => {
                if (err) return console.error(err)
                console.log("success!")
            });

        });

        function onErr(err) {
            console.log(err);
            return 1;
        }

        return;
    }

}

main();