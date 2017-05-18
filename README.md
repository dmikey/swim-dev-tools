# swim-dev 1.1.8

### Change Log

#### 1.1.8

* js standard and js beautify now on board. You can run these easily by simply using `swim-dev --clean --validate`

#### 1.1.7

* modified draw cycle, so that element declares state dirty on draw, and no longer clocked to 166ms.
* fixed an issue where our provided `debug` was messing with `SocketJS`. 

Swim CLI, the easiest way to build Swim Apps.

## platforms

This tool currently supports 

- [x] Web
- [ ] Android (java)
- [ ] iOS (xcode)
- [ ] Other

## features

- [x] Supports LESS
- [x] Supports SASS
- [x] Generates `index.html` Fixture from EJS
- [x] Packages Bower modules using 'require'
- [x] Packages NPM modules
- [x] Supports a number of loader formats out of the box (raw, image, style)
- [x] Self contained dependencies, build tools do not need to mingle with your project
- [x] Dev server with Hot Reload (no browser refresh)
- [x] Support for ES6
- [x] Tree Shaking
- [x] Provides: jQuery, LoDash, Material Design Lite, Font Awesome, Material Icons
- [x] Sugar around the Swim Client API with Web Workers

## usage

### serve

Creates a development server, with hot reload. Currently does not spin up a Swim services server (todo).

```bash
swim-dev --serve
```

* Change Ports by using the `--port=8081` flag. Default port is `8080`

### build

Builds the project for distribution.

```bash
swim-dev --build
```

### run code beautifer

```bash
swim-dev --clean
```

### run code linter

```
swim-dev --validate
```

### benefits

* Standard Collection of Swim supported libraries and components
* Allows bower and npm module usage with project
* Bundle Images, Style, Modules togther!
* Easy to use!
* Comes with a large number of base libraries, Swim Project has a clean and clear dependency chain
* More to come!

### roadmap

* Support JSX with a JSX to inline function transform

### getting started

Download and install Swim Dev Tools. Currently available on NPM. Requires NodeJS `6.x.x`

```bash
npm install swim-dev-tools -g
```

The `swim-dev` command should now be available at the command line.

### short cuts

Extra sugar to help you get around your project faster

* `$project_dir/components/$name_of_component` is short handed to `components/$name_of_component`
* `$project_dir/store` is short handed to `store`

### provided modules / swim-dev injected

Double Unders are used in Swim-Dev. These Double Unders allow Swim-Dev to instance needed libraries.

```
__material__ // include material design lite in the project.

__fontawesome__ // include font awesome with the project.


```

You can get the debug status of the app. This pattern is for compatibility with other libraries that complain about our injection.

```
var isDebug = debug('app-name')();
```

Third Party Library

```javascript
$() // jquery
moment // moment
_ // lodash
Router // a router instance from the Director Library
Script // script loader Script(url);
Lawnchair // lawnchair library
d3 // d3 visualization library
c3 // chart library
```

Swim inspired additions to the framework 

```javascript
Swim // swim-client
Recon // recon data library

tag // swim sugared X-Tag implimentation
Draw // swim draw manager can be used stand-alone

Store // swim flux store with webworker integration, sugars swim-client
Dispatcher // swim flux dispatcher
```

### notes

* When creating new controls using `Material Design Lite` when you add a Ripple, also remove Ripple events by adding `mdl-js-ripple-effect--ignore-events` to the HTML element's class list.

### credits

Built with webpack, and a number of open source webpack modules.
