var $ = require('jquery');

var Main = module.exports = require('../core')({
  $: $,
  DOMParser: DOMParser,
  XMLSerializer: XMLSerializer,
  btoa: btoa,
  fetchSvg: function (location, options) {
    var fetched = $.Deferred(),
        ajaxSettings = $.extend({}, options);

    Object.keys(Main.load.defaultOptions).forEach(function (key) {
      delete ajaxSettings[key];
    });

    $.ajax(location, ajaxSettings).then(function (data, status, xhr) {
      var xml = xhr.responseXML;

      fetched.resolve(xml instanceof Document && xml.documentElement ||
          (typeof options.decode === 'function' ? options.decode(data) : xhr.responseText));
    }).fail(function (xhr, status, error) {
      fetched.reject(error);
    });

    return fetched;
  },
  writeRules: function (rules, options) {
    var style = document.createElement('style');

    style.className = options.family + ' icons';
    document.head.appendChild(style);

    var styleSheet = style.sheet,
        cssRules = styleSheet.cssRules;

    rules.forEach(function (rule) {
      styleSheet.insertRule(rule, cssRules.length);
    });
  }
});
