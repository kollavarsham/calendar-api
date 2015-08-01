'use strict';

var debug = require('debug')('calendar:routes:month'),
  express = require('express'),
  common = require('./common'),
  dayRouter = require('./day'),
  validators = require('../lib/validators'),
  kollavarsham = require('./../lib/kollavarsham');

var monthRouter = express.Router({mergeParams : true});

monthRouter.route('/:month').get(validators.validateYear, validators.validateMonth, function (req, res) {
  debug('Within the month route');
  var year = parseInt(req.params.year, 10);
  var month = parseInt(req.params.month, 10);

  var output = kollavarsham.getMonth(year, month - 1, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

monthRouter.use('/:month/days', dayRouter);

module.exports = monthRouter;