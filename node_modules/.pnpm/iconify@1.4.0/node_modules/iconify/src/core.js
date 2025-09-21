// Module dependencies that must be defined (aka "injected") when used:
var $, DOMParser, XMLSerializer, btoa, fetchSvg, writeRules;

var hash = require('js-sha256');

function Main (el) {
  var $el = el instanceof $ ? el : $(el);

  if ($el.hasClass('inline')) {
    return $el;
  }

  var iconData = $el.css('-webkit-mask-box-image') || $el.css('mask-image');

  if (iconData !== 'none') {
    var iconHash = hash(iconData),
        svgElement;

    if ((svgElement = Main.__inlineCache__[iconHash]) === undefined) {
      var decode = iconData.match(/;(.*),/)[1] === 'base64' ? atob : decodeURI,
          encodedSvg = iconData.match(/;.*,([^")]*)/)[1];

      Main.__inlineCache__[iconHash] = svgElement = $(decode(encodedSvg)).attr({
        width: '100%',
        height: '100%'
      })[0];
    }

    return $el.addClass('inline').append(svgElement.cloneNode(true));
  } else {
    throw new MainError('Missing icon data', { el: $el[0] });
  }
}

Main.load = function (svg, options) {
  options = $.extend({}, Main.load.defaultOptions, options);

  var svgLoad = $.Deferred(),
      finish = $.Deferred(),
      ruleSelectorPrefix = '.' + options.family,
      dataUriFormat = options.dataUriFormat,
      encodeUriData = options.dataUriFormat === 'base64' ? btoa : encodeURI;

  function generateIconRule (el) {
    var viewBoxValue = el.getAttribute('viewBox'),
        viewBox = (viewBoxValue && viewBoxValue.split(/\s+/g)) || [0, 0, 8, 8],
        dimensions = { width: viewBox[2], height: viewBox[3] },
        content = '';

    if (el.firstElementChild !== null && el.firstElementChild !== undefined) {
      var childNode = el.firstElementChild;

      do {
        content += xmlToString(childNode);
        childNode = childNode.nextElementSibling;
      } while (childNode !== null && childNode !== undefined);
    } else {
      content = xmlToString(el);
    }

    var url = 'url(data:image/svg+xml;' + dataUriFormat + ',' +
      encodeUriData(xmlToString($('<svg xmlns="http://www.w3.org/2000/svg">').attr({
        width: dimensions.width,
        height: dimensions.height,
        viewBox: [0, 0, dimensions.width, dimensions.height].join(' ')
      }).html(content)[0])) + ')';

    return ruleSelectorPrefix + '.' + $(el).attr('id') +
      '{' +
        '-webkit-mask-box-image:' + url + ';' +
        'mask-image:' + url + ';' +
        'mask-size:contain;' +
      '}';
  }

  try {
    svgLoad.resolve(parseSvg(svg));
  } catch (e) {
    if (e instanceof ParseError) {
      fetchSvg(svg, options).then(function (svgDoc) {
        try {
          svgLoad.resolve(typeof svgDoc === 'string' ? parseSvg(svgDoc) : svgDoc);
        } catch (e) {
          finish.reject(e);
        }
      }).fail(function (fetchError) {
        finish.reject(new MainError('Could not load icons', {
          src: svg,
          errors: [e, fetchError]
        }));
      });
    } else {
      finish.reject(e);
    }
  }

  svgLoad.then(function (svg) {
    var $icons = $(svg).find('*').filter(function (index, el) {
      var $el = $(el);

      return $el.attr('id') && $el.parents().toArray().some(function (parent) {
        return !$(parent).attr('id');
      });
    });

    if ($icons.length === 0 && options.name) {
      $icons = $(svg).attr('id', options.name);
    }

    if ($icons.length === 0) {
      return finish.reject(new Main.Error('No icons found. Maybe specify a name?', {
        svg: xmlToString(svg),
        name: options.name
      }));
    }

    function ruleFromObject (selector, obj) {
      var ruleString = selector + '{';

      for (var propName in obj) {
        ruleString += propName + ':' + obj[propName] + ';';
      }

      return ruleString + '}';
    }

    var families = Main[familiesProp],
        familyIcons = families[options.family] = families[options.family] || [],
        rules = (Object.keys(familyIcons).length === 0 ? [

          // Main family rule
          ruleFromObject(ruleSelectorPrefix, $.extend({ 'display': 'inline-block' }, options.css)),

          // Rule for inlined icons from family
          ruleFromObject('.inline' + ruleSelectorPrefix, {
            'background-color': 'transparent',
            '-webkit-mask-box-image': 'none !important',
            'mask-image': 'none !important'
          }),

          // Rule for inlined SVG element from family
          ruleFromObject('.inline' + ruleSelectorPrefix + ' svg', { 'display': 'block' })
        ] : []).concat($icons.toArray().map(function (el) {
          var rule = familyIcons[$(el).attr('id')] = generateIconRule(el);

          return rule;
        }));

    writeRules(rules, options);

    finish.resolve();
  });

  return finish;
};

Main.load.defaultOptions = {
  dataUriFormat: 'base64',
  decode: null,
  family: 'icon',
  name: null,
  css: null,
  output: null
};

var familiesProp = '__families__';

Main[familiesProp] = {};
Main.__inlineCache__ = {};

var MainError = Main.Error = function (message, details) {
  this.message = message;
  this.details = details;
};

MainError.prototype = new Error();

var ParseError = function () {
  MainError.apply(this, arguments);
};

ParseError.prototype = new MainError();

// Some Utilities:

function parseSvg (svg) {
  if (typeof svg !== 'string') {
    throw new TypeError('Failed to parse non-string target: ' + JSON.stringify(svg));
  }

  var doc = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;

  if (doc === null || doc === undefined || doc.getElementsByTagName('parsererror').length !== 0) {
    throw new ParseError('Invalid SVG and/or XML', { src: svg, result: doc });
  } else if (!/svg/i.test(doc.tagName)) {
    throw new MainError('Parsed XML is not SVG', { src: svg, result: doc });
  } else {
    return doc;
  }
}

function xmlToString (node) {
  return new XMLSerializer().serializeToString(node);
}

// Don't export module itself, but rather the means to define (aka "inject") module dependencies:
module.exports = function (deps) {
  var unmetDeps = [];

  ['$', 'DOMParser', 'XMLSerializer', 'btoa', 'fetchSvg', 'writeRules'].forEach(function (name) {
    if ((deps || {})[name] === undefined) {
      unmetDeps.push(name);
    }
  });

  if (unmetDeps.length !== 0) {
    throw new Error('Unmet dependency(-ies): ' + unmetDeps.join(', '), { deps: deps });
  }

  $ = deps.$;
  DOMParser = deps.DOMParser;
  XMLSerializer = deps.XMLSerializer;
  btoa = deps.btoa;
  fetchSvg = deps.fetchSvg;
  writeRules = deps.writeRules;

  return $.extend(Main, deps);
};
