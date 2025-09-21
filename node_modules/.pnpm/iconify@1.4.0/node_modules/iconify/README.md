[![NPM version](https://img.shields.io/npm/v/iconify.svg?style=flat)](https://www.npmjs.com/package/iconify)
[![Build Status](https://img.shields.io/travis/emarschner/iconify.svg?style=flat)](https://travis-ci.org/emarschner/iconify)
[![Coverage Status](https://img.shields.io/coveralls/emarschner/iconify.svg?style=flat)](https://coveralls.io/r/emarschner/iconify)
[![Dependency Status](https://img.shields.io/david/emarschner/iconify.svg?style=flat)](https://david-dm.org/emarschner/iconify)
[![devDependency Status](https://img.shields.io/david/dev/emarschner/iconify.svg?style=flat)](https://david-dm.org/emarschner/iconify#info=devDependencies)

`iconify` lets you use SVG images as icons on the web with pure CSS and/or DOM injection.

It runs on both the server/command-line and in the browser. On the server it helps you generate static CSS files. In the browser it helps you dynamically generate CSS rules from SVG images for monochromatic icons, as well as inject SVG content into the DOM for richer customization (multiple colors, animations, etc.).

# How it works

`iconify` takes an SVG file like this one (for the "thumb-up" icon from [open-iconic](https://useiconic.com/open/)):

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
  <path d="M4.47 0c-.19.02-.37.15-.47.34-.13.26-1.09 2.19-1.28 2.38-.19.19-.44.28-.72.28v4h3.5c.21 0 .39-.13.47-.31 0 0 1.03-2.91 1.03-3.19 0-.28-.22-.5-.5-.5h-1.5c-.28 0-.5-.25-.5-.5s.39-1.58.47-1.84c.08-.26-.05-.54-.31-.63-.07-.02-.12-.04-.19-.03zm-4.47 3v4h1v-4h-1z" />
</svg>
```

which looks like:

![black thumb-up icon](http://emarschner.github.io/iconify/img/thumb-up-black.png)

and creates CSS rules like these:

```css
.icon {
  display: inline-block;
}
.inline.icon {
  background-color: transparent;
  -webkit-mask-box-image: none !important;
}
.inline.icon svg {
  display: block;
}
.icon.thumb-up {
  -webkit-mask-box-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdib3g9IjAgMCA4IDgiPjxwYXRoIGQ9Im00LjQ3IDBjLS4xOS4wMi0uMzcuMTUtLjQ3LjM0LS4xMy4yNi0xLjA5IDIuMTktMS4yOCAyLjM4LS4xOS4xOS0uNDQuMjgtLjcyLjI4djRoMy41Yy4yMSAwIC4zOS0uMTMuNDctLjMxIDAgMCAxLjAzLTIuOTEgMS4wMy0zLjE5IDAtLjI4LS4yMi0uNS0uNS0uNWgtMS41Yy0uMjggMC0uNS0uMjUtLjUtLjVzLjM5LTEuNTguNDctMS44NGMuMDgtLjI2LS4wNS0uNTQtLjMxLS42My0uMDctLjAyLS4xMi0uMDQtLjE5LS4wM3ptLTQuNDcgM3Y0aDF2LTRoLTF6Ii8+PC9zdmc+);
}
```

The last rule there for `.icon.thumb-up` is the really important one. Its `-webkit-mask-box-image` property value is a base64-encoded data URI that represents the contents of the original SVG image.

## Monochromatic icons

Using SVG images as masks allows re-use of single rules to render icons with any color you want by setting the CSS `background-color` of a particular icon element. For example, in addition to the above CSS, if your document contains this:

```html
<div class="thumb-up icon"></div>
```

and you add this to your page's CSS:

```css
.icon {
   background-color: hotpink;
   width: 5em;
   height: 5em;
}
```

then you will get this:

![hotpink thumb-up icon](http://emarschner.github.io/iconify/img/thumb-up-hotpink.png)

## Fancier icons via inline SVG injection

If you need fancier icons -- e.g. with more colors, clever animations, or other pretty effects -- then `iconify` can help as well. If you start with the monochromatic example above and then do this:

```javascript
iconify($('.thumb-up.icon'));
```

with some extra CSS:

```css
.inline.icon {
  fill: hotpink;
}
```

then your page will look the same as above, but the icon element's DOM will now look like this:

```html
<div class="inline thumb-up icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 8 8">
    <path d="M4.47 0c-.19.02-.37.15-.47.34-.13.26-1.09 2.19-1.28 2.38-.19.19-.44.28-.72.28v4h3.5c.21 0 .39-.13.47-.31 0 0 1.03-2.91 1.03-3.19 0-.28-.22-.5-.5-.5h-1.5c-.28 0-.5-.25-.5-.5s.39-1.58.47-1.84c.08-.26-.05-.54-.31-.63-.07-.02-.12-.04-.19-.03zm-4.47 3v4h1v-4h-1z" />
  </svg>
</div>
```

You can then manipulate the inlined SVG content as you wish. For example, change it to an outline:

```css
.inline.icon {
  fill: none;
  stroke: black;
  stroke-width: .1;
}
.inline.icon path {
  transform: translate(.05px, .05px);
}
```

![outline thumb-up icon](http://emarschner.github.io/iconify/img/thumb-up-outline.png)

# Installation

`npm install iconify [-g]`

**Note** - as of `iconify@1.0.0`, NodeJS version `4.x` or newer is required due to `jsdom@>=7.0.0`'s requirement as such ([read why here](https://github.com/tmpvar/jsdom/blob/master/Changelog.md#700)). `iconify@0` maintains compatibility with NodeJS versions as early as `0.10.x`, but should be considered deprecated.

# Usage

## Command-line

`iconify icons.svg > icons.css`

## Server code

```javascript
require('iconify').load('icons.svg', {
  output: process.stdout // or any stream.Writable
});
```

## Browser code

### Static CSS

```html
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="icons.css" />
  </head>
  <body>
    <div class="my-cool icon"></div>
  </body>
</html>
```

### Dynamic CSS

```html
<html>
  <head>
    <script type="text/javascript" src="iconify.js"></script>
    <script type="text/javascript">
      iconify.load('icons.svg').then(function() {

        // Optionally inject inline SVG for the icon:
        iconify(document.querySelector('.my-cool.icon'));
      });
    </script>
  </head>
  <body>
    <div class="my-cool icon"></div>
  </body>
</html>
```

See [`examples/`](http://emarschner.github.io/iconify/examples/) for more...examples.

## API

### iconify(_icon_element_)

Injects SVG content inline into `icon_element`.

Returns jQuery-wrapped `icon_element` for chaining.

*  **_icon_element_** can be either a plain old DOM element, or already wrapped with jQuery, and should have classes specifying both the icon family (default: `.icon`) and icon name (e.g. `.thumb-up`) as defined by some pre-existing static CSS, or use of `iconify.load()`.

### iconify.load(_source_image_, [ _options = { ... }_ ])

Generates CSS rules for icons from `source_image`.

Returns a [`jQuery.Deferred`](http://api.jquery.com/category/deferred-object/) "promise" that resolves when CSS rules are successfully generated, or is rejected if there's a problem.

*  **_source_image_** can be either the path/URL (server-/client-side, respectively) to an SVG file, or a string containing the SVG content itself
*  **_options_** (optional) used to customize the resulting CSS; defaults:

```javascript
{
  dataUriFormat: 'base64',
  family: 'icon'
}
```

See source for more details...

## CLI

### `iconify [--options] <file> [<file 2> ... <file N>]`

Outputs CSS rules to stdout for icons from `<file> [<file 2> ... <file N>]` as if those files were given to `iconify.load()`.

* **_[--options]_** can be specified to customize a particular command's behavior. All of the `options` that can be provided to `iconify.load()` can be specified this way, with their names dash-ed rather than camelCased  -- e.g. `--data-uri-format base64` would be equivalent to `{ dataUriFormat: 'base64' }`
* **_`<file> [<file 2> ... <file N>]`_**: at least one path to an input file (`<file>`) is required, which will be converted into CSS rules for the icon(s) defined therein. If a file contains a single icon then the file's name, minus the extension, will be the default name for that icon, unless one is already given via the `--name` option.

### Transforms

An additional `--transform <transformer>[,<transformer 2>,...,<transformer N>]` option is available to allow arbitrary customization of how file contents are processed, and with which options. The `<transformer>`s given will be resolved and loaded as NodeJS modules defining appropriate transformer functions.

A transformer function is any function accepting two arguments, i.e. `function(input, output) { ... }`, where `input` is a [readable stream](http://nodejs.org/api/stream.html#stream_class_stream_readable) and `output` is a [writable stream](http://nodejs.org/api/stream.html#stream_class_stream_writable), both in [object mode](http://nodejs.org/api/stream.html#stream_object_mode). Objects read from or written to these streams should contain `source` and `options` properties, which will ultimately be used as the first and second arguments to `iconify.load()`, respectively.

For example, here's a contrived transformer function that will set the icon family to `magicon`:

```javascript
// set-family.js
module.exports = function(input, output) {
  input.on('data', function(item) {
    item.options.family = 'magicon';
    output.write(item);
  });
};
```

which could be used like so:

```
iconify --transform ./set-family my-icons.svg
```

(Of course in this case you could also just use the global `--family` option: `iconify --family magicon my-icons.svg`.)

When multiple comma-separated paths are given to the `--transform` option then the corresponding transformer functions are chained together, with the `input` of one being the `output` from the one before it.

# Credits

Much inspiration taken from [Iconic](https://useiconic.com/).
