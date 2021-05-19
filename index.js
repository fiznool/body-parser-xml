'use strict';

const xml2js = require('xml2js');

const DEFAULT_TYPES = ['*/xml', '+xml'];

module.exports = function (bodyParser) {
  if (bodyParser.xml) {
    // We already setup the XML parser.
    // End early.
    return;
  }

  function xml(options) {
    options = options || {};

    options.type = options.type || DEFAULT_TYPES;

    const textParser = bodyParser.text(options);
    return function xmlParser(req, res, next) {
      // First, run the body through the text parser.
      textParser(req, res, function (err) {
        if (err) {
          return next(err);
        }
        if (typeof req.body !== 'string') {
          return next();
        }

        // Then, parse as XML.
        const xmlParseOptions = {
          ...options.xmlParseOptions,
          // Always opt-in to async mode.
          async: true,
        };
        const parser = new xml2js.Parser(xmlParseOptions);

        // In some cases xml2js.Parser parseString() can throw an error after executing the callback.

        parser.parseString(req.body, function (err, xml) {
          if (err) {
            err.status = 400;
            return next(err);
          }

          if (xml) {
            // Guard against prototype pollution
            delete xml.__proto__;
            delete xml.constructor;
            delete xml.prototype;

            // Set result on the request body
            req.body = xml;
          }

          next();
        });
      });
    };
  }

  // Finally add the `xml` function to the bodyParser.
  Object.defineProperty(bodyParser, 'xml', {
    configurable: true,
    enumerable: true,
    get: function () {
      return xml;
    },
  });
};
