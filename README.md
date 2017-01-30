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

## install

Install Swim CLI globally, optionally you can install locally to peg a specific version of Swim CLI, and drive the CLI using `npm scripts`.

```bash
npm install -g swim-dev-tools
```

## usage

### serve

Creates a development server, with hot reload. Currently does not spin up a Swim services server (todo).

```bash
swim-dev --serve
```

### build

Builds the project for distribution.

```bash
swim-dev --build
```


### benefits

* Standard Collection of Swim supported libraries and components
* Allows bower and npm module usage with project
* Bundle Images, Style, Modules togther
* Supports Polymer Components with `polymer-ext` for CommonJS Components
* Easy to use!
* Comes with a large number of base libraries, Swim Project has a clean and clear dependency chain
* More to come!

### roadmap

* Support JSX with a JSX to inline function transform

### notes

* When creating new controls using `Material Design Lite` when you add a Ripple, also remove Ripple events by adding `mdl-js-ripple-effect--ignore-events` to the HTML element's class list.

### credits

Built with webpack, and a number of open source webpack modules.
