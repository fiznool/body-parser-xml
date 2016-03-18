'use strict';

var xml2js = require('xml2js');

var DEFAULT_TYPES = ['*/xml', '+xml'];

module.exports = function(bodyParser) {
  if(bodyParser.xml) {
    // We already setup the XML parser.
    // End early.
    return;
  }

  function xml(options) {
    options = options || {};

    options.type = options.type || DEFAULT_TYPES;
    if(!Array.isArray(options.type)) {
      options.type = [options.type];
    }

    var textParser = bodyParser.text(options);
    return function xmlParser(req, res, next) {
      // First, run the body through the text parser.
      textParser(req, res, function(err) {
        if(err) { return next(err); }
        if(typeof req.body !== 'string') { return next(); }

        // Then, parse as XML.
        var parser = new xml2js.Parser(options.xmlParseOptions);
        parser.parseString(req.body, function(err, xml) {
          if(err) {
            err.status = 400;
            return next(err);
          }

          req.body = xml || req.body;
          next();
        });
      });
    };
  }

  // Finally add the `xml` function to the bodyParser.
  Object.defineProperty(bodyParser, 'xml', {
    configurable: true,
    enumerable: true,
    get: function() {
      return xml;
    }
  });
};
