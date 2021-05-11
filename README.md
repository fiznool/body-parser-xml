# XML Body Parser

Adds XML parsing to the [body-parser](https://github.com/expressjs/body-parser) library, so you can convert incoming XML data into a JSON representation.

This is really useful if you want to deal with plain old JavaScript objects, but you need to interface with XML APIs.

[![Build Status](https://github.com/fiznool/body-parser-xml/workflows/Node.js%20CI/badge.svg)](https://github.com/fiznool/body-parser-xml/workflows/Node.js%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/body-parser-xml)](https://img.shields.io/npm/v/body-parser-xml)
[![npm downloads per week](https://img.shields.io/npm/dw/body-parser-xml?color=blue)](https://img.shields.io/npm/dw/body-parser-xml?color=blue)
[![Dependency Status](https://david-dm.org/fiznool/body-parser-xml.svg)](https://david-dm.org/fiznool/body-parser-xml)
[![devDependency Status](https://david-dm.org/fiznool/body-parser-xml/dev-status.svg)](https://david-dm.org/fiznool/body-parser-xml#info=devDependencies)

## Installation

```
npm install express body-parser body-parser-xml
```

## Usage

This library adds an `xml` method to the `body-parser` object.

Initialise like so:

```js
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
```

Once initialised, you can use it just like any other `body-parser` middleware:

```js
const app = require('express')();
app.use(bodyParser.xml());
```

This will parse any XML-based request and place it as a JavaScript object on `req.body` for your route handlers to use.

An XML-based request is determined by the value of the `Content-Type` header. By default, any `Content-Type` header ending in `/xml` or `+xml` will be parsed as XML. For example, the following Content-Types will all match:

- `text/xml`
- `application/xml`
- `application/rss+xml`

If you need to match against a custom `Content-Type` header, pass in the `type` to match as an option (see below).

### Options

You can also pass in options:

```js
app.use(bodyParser.xml(options));
```

The `options` object accepts any of the following keys:

#### defaultCharset

Specify the default character set for the text content if the charset is not specified in the `Content-Type` header of the request. Defaults to `utf-8`.

#### inflate

When set to `true`, then deflated (compressed) bodies will be inflated; when `false`, deflated bodies are rejected. Defaults to `true`.

#### limit

Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the [bytes](https://www.npmjs.com/package/bytes) library for parsing. Defaults to `'100kb'`.

#### type

The type option is used to determine what media type the middleware will parse. This option can be a string, array of strings, or a function. If not a function, type option is passed directly to the type-is library and this can be an extension name (like xml), a mime type (like application/xml), or a mime type with a wildcard (like _/_ or _/xml). If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value. Defaults to `['_/xml', '+xml']`.

#### verify

The `verify` option, if supplied, is called as `verify(req, res, buf, encoding)`, where `buf` is a `Buffer` of the raw request body and `encoding` is the encoding of the request. The parsing can be aborted by throwing an error.

#### xmlParseOptions

This option controls the behaviour of the XML parser. You can pass any option that is supported by the [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) library: [see here](https://github.com/Leonidas-from-XIV/node-xml2js#options) for a list of these options.

## Example

```js
const express = require('express');
const bodyParser = require('body-parser');

require('body-parser-xml')(bodyParser);

const app = express();
app.use(
  bodyParser.xml({
    limit: '1MB', // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false, // Only put nodes in array if >1
    },
  }),
);

app.post('/users', function (req, res, body) {
  // Any request with an XML payload will be parsed
  // and a JavaScript object produced on req.body
  // corresponding to the request payload.
  console.log(req.body);
  res.status(200).end();
});
```

## Motivation

This library was born out of a frustration that [express-xml-bodyparser](https://github.com/macedigital/express-xml-bodyparser), the most popular XML-parsing library for express, doesn't support the regular `body-parser` options - in particular, limiting the payload size.

This library was written to use `body-parser`'s text parser under the hood, and then passes the parsed string into the XML parser. We can therefore take advantage of `body-parser`'s regular options, and support limiting the payload size, amongst other things.

## License

MIT
