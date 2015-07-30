'use strict';

var debug = require('debug')('calendar:year'),
  express = require('express'),
  monthRouter = require('./month'),
  validators = require('../lib/validators'),
  kollavarsham = require('./../lib/kollavarsham');

var yearRouter = express.Router();

yearRouter.route('/years/:year').get(validators.validateYear, function (req, res) {
  var year = parseInt(req.params.year, 10);

  var output = kollavarsham.getYear(year);

  if (req.accepts('text')) {
    debug('sending text output');
    res.send(output.text);
    return;
  }

  if (req.accepts('json')) {
    debug('sending json output');
    res.send(output.json);
    return;
  }

  res.type('txt').send(output.text);
});

yearRouter.use('/years/:year/months', monthRouter);

module.exports = yearRouter;