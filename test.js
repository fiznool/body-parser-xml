'use strict';

var express = require('express'),
    request = require('supertest'),
    bodyParser = require('body-parser');

// Add xml parsing to bodyParser.
// In real-life you'd `require('body-parser-xml')`.
require('./index.js')(bodyParser);

describe('XML Body Parser', function() {
  var app;

  var createServer = function(options) {
    app = express();
    app.set('env', 'test');
    app.use(bodyParser.xml(options));
    app.post('/', function(req, res) {
      res.status(200).send({ parsed: req.body });
    });
  };

  beforeEach(function() {
    app = null;
  });

  it('should parse a body with content-type application/xml', function(done) {
    createServer();

    request(app)
      .post('/')
      .set('Content-Type', 'application/xml')
      .send('<customer><name>Bob</name></customer>')
      .expect(200, { parsed: { customer: { name: ['Bob'] } } }, done);
  });

  it('should parse a body with content-type text/xml', function(done) {
    createServer();

    request(app)
      .post('/')
      .set('Content-Type', 'text/xml')
      .send('<customer><name>Bob</name></customer>')
      .expect(200, { parsed: { customer: { name: ['Bob'] } } }, done);
  });

  it('should parse a body with content-type application/rss+xml', function(done) {
    createServer();

    request(app)
      .post('/')
      .set('Content-Type', 'application/rss+xml')
      .send('<customer><name>Bob</name></customer>')
      .expect(200, { parsed: { customer: { name: ['Bob'] } } }, done);
  });

  it('should accept xmlParseOptions', function(done) {
   createServer({
      xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
      }
    });
    request(app)
      .post('/')
      .set('Content-Type', 'text/xml')
      .send('<CUSTOMER><name>Bob</name></CUSTOMER>')
      .expect(200, { parsed: { customer: { name: 'Bob' } } }, done);
  });

  it('should accept custom ContentType as array', function(done) {
    createServer({
      type: ['application/custom-xml-type']
    });
    request(app)
        .post('/')
        .set('Content-Type', 'application/custom-xml-type')
        .send('<customer><name>Bob</name></customer>')
        .expect(200, { parsed: { customer: { name: ['Bob'] } } }, done);
  });

  it('should accept custom ContentType as string', function(done) {
    createServer({
      type: 'application/custom-xml-type'
    });
    request(app)
        .post('/')
        .set('Content-Type', 'application/custom-xml-type')
        .send('<customer><name>Bob</name></customer>')
        .expect(200, { parsed: { customer: { name: ['Bob'] } } }, done);
  });

  it('should ignore non-XML', function(done) {
    createServer();

    request(app)
      .post('/')
      .set('Content-Type', 'text/plain')
      .send('Customer name: Bob')
      .expect(200, { parsed: {} }, done);
  });

  it('should reject invalid XML', function(done) {
    createServer();
    request(app)
      .post('/')
      .set('Content-Type', 'text/xml')
      .send('<invalid-xml>')
      .expect(400, done);
  });
});
