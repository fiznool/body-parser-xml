'use strict';

var xml2js = require('xml2js');

module.exports = function(bodyParser) {
  var xmlTypes = ['*/xml', '+xml'];
  if(bodyParser.xml) {
    // We already setup the XML parser.
    // End early.
    return;
  }

  function xml(options) {
    var textParser;
    options = options || {};
    if(options.type){
      if(Array.isArray(options.type)){
        xmlTypes = options.type.concat(xmlTypes);
      }else if(typeof options.type === 'string'){
        xmlTypes.push(options.type);
      }
      options.type = xmlTypes;
    }

    options.type = xmlTypes;
    textParser= bodyParser.text(options);
    return function xmlParser(req, res, next) {
      var parser;
      // First, run the body through the text parser.
      textParser(req, res, function(err) {
        if(err) { return next(err); }
        if(typeof req.body !== 'string') { return next(); }

        // Then, parse as XML.
        parser = new xml2js.Parser(options.xmlParseOptions);
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
