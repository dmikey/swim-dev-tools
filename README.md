# swim-dev

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

### notes

* When creating new controls using `Material Design Lite` when you add a Ripple, also remove Ripple events by adding `mdl-js-ripple-effect--ignore-events` to the HTML element's class list.

### credits

Built with webpack, and a number of open source webpack modules.
