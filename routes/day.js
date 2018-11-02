'use strict';

const debug = require('debug')('calendar:routes:day');
const express = require('express');
const common = require('./common');
const validators = require('../lib/validators');
const kollavarsham = require('./../lib/kollavarsham');

const dayRouter = express.Router({mergeParams : true});

dayRouter.route('/:day').get(validators.validateYear, validators.validateMonth, validators.validateDay, function (req, res) {
  debug('Within the day route');
  const year = parseInt(req.params.year, 10);
  const month = parseInt(req.params.month, 10);
  const day = parseInt(req.params.day, 10);

  const output = kollavarsham.getDay(year, month - 1, day, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

dayRouter.use(':month/days', dayRouter);

module.exports = dayRouter;