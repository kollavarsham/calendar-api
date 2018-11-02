'use strict';

const debug = require('debug')('calendar:routes:year');
const express = require('express');
const common = require('./common');
const monthRouter = require('./month');
const validators = require('../lib/validators');
const kollavarsham = require('./../lib/kollavarsham');

const yearRouter = express.Router();

yearRouter.route('/years/:year').get(validators.validateYear, function (req, res) {
  debug('Within the month route');
  const year = parseInt(req.params.year, 10);

  const output = kollavarsham.getYear(year, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

yearRouter.use('/years/:year/months', monthRouter);

module.exports = yearRouter;