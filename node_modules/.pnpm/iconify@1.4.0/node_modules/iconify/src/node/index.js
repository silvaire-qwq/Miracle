var jsdom = require('jsdom'),
    $ = require('jquery')((new jsdom.JSDOM('')).window.document.defaultView),
    fs = require('fs');

module.exports = require('../core')({
  $: $,
  DOMParser: function () {
    this.parseFromString = function (markup) {
      return { documentElement: (new jsdom.JSDOM(markup)).window.document.querySelector('svg') };
    };
  },
  XMLSerializer: function () {
    this.serializeToString = function (node) {
      return node.outerHTML;
    };
  },
  btoa: require('btoa'),
  fetchSvg: function (location) {
    var fetched = $.Deferred();

    fs.readFile(location, function (err, data) {
      if (err !== null && err !== undefined) {
        return fetched.reject(err);
      }

      fetched.resolve(data.toString());
    });

    return fetched;
  },
  writeRules: function (rules, options) {
    var output = options.output;

    rules.forEach(function (rule) {
      output.write(rule + '\n');
    });

    if (output !== process.stdout) {
      output.end();
    }
  }
});
