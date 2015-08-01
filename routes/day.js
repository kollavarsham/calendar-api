'use strict';

var debug = require('debug')('calendar:routes:day'),
  express = require('express'),
  common = require('./common'),
  validators = require('../lib/validators'),
  kollavarsham = require('./../lib/kollavarsham');

var dayRouter = express.Router({mergeParams : true});

dayRouter.route('/:day').get(validators.validateYear, validators.validateMonth, validators.validateDay, function (req, res) {
  debug('Within the day route');
  var year = parseInt(req.params.year, 10);
  var month = parseInt(req.params.month, 10);
  var day = parseInt(req.params.day, 10);

  var output = kollavarsham.getDay(year, month - 1, day, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

dayRouter.use(':month/days', dayRouter);

module.exports = dayRouter;