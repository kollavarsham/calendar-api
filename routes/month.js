'use strict';

const debug = require('debug')('calendar:routes:month');
const express = require('express');
const common = require('./common');
const dayRouter = require('./day');
const validators = require('../lib/validators');
const kollavarsham = require('./../lib/kollavarsham');

const monthRouter = express.Router({mergeParams : true});

monthRouter.route('/:month').get(validators.validateYear, validators.validateMonth, function (req, res) {
  debug('Within the month route');
  const year = parseInt(req.params.year, 10);
  const month = parseInt(req.params.month, 10);

  const output = kollavarsham.getMonth(year, month - 1, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

monthRouter.use('/:month/days', dayRouter);

module.exports = monthRouter;