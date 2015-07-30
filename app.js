'use strict';

var debug = require('debug')('calendar:app'),
  express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  helmet = require('helmet'),
  cors = require('cors'),
  yearRouter = require('./routes/year');

module.exports = function () {
  // Initialize express app
  debug('Initializing a new express app...');
  var app = express();

  // set the environment to be development
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  // Set up CORS
  app.use(cors());

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Should be placed before express.static
  app.use(compress({
    filter : function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level  : 9
  }));

  // Showing stack errors
  app.set('showStackError', true);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended : true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');

  var router = express.Router();              // get an instance of the express Router

  router.get('/', function (req, res) {
    res.json({message : 'Welcome to Kollavrsham API!!1'});
  });

  router.use('/', yearRouter);

  // all of our routes will be prefixed with /api
  app.use('/api', router);

  // Return Express server instance
  return app;
};
