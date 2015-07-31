'use strict';

var debug = require('debug')('calendar:day'),
  express = require('express'),
  validators = require('../lib/validators'),
  kollavarsham = require('./../lib/kollavarsham');

var dayRouter = express.Router({mergeParams : true});

dayRouter.route('/:day').get(validators.validateYear, validators.validateMonth, validators.validateDay, function (req, res) {
  var year = parseInt(req.params.year, 10);
  var month = parseInt(req.params.month, 10);
  var day = parseInt(req.params.day, 10);

  var output = kollavarsham.getDay(year, month - 1, day, req.query.lang);

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

dayRouter.use(':month/days', dayRouter);

module.exports = dayRouter;