'use strict';

var xml2js = require('xml2js'),
    typeis = require('type-is');

module.exports = function(bodyParser) {
  if(bodyParser.xml) {
    // We already setup the XML parser.
    // End early.
    return;
  }

  var xmlTypes = ['application/xml', 'text/xml'];

  function xml(options) {
    options = options || {};
    options.type = xmlTypes;

    var textParser = bodyParser.text(options);
    return function xmlParser(req, res, next) {
      // First, run the body through the text parser.
      textParser(req, res, function(err) {
        if(err) { return next(err); }
        if(!typeis(req, xmlTypes)) { return next(); }

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
