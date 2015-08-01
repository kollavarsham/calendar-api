'use strict';

var debug = require('debug')('calendar:routes:year'),
  express = require('express'),
  common = require('./common'),
  monthRouter = require('./month'),
  validators = require('../lib/validators'),
  kollavarsham = require('./../lib/kollavarsham');

var yearRouter = express.Router();

yearRouter.route('/years/:year').get(validators.validateYear, function (req, res) {
  debug('Within the month route');
  var year = parseInt(req.params.year, 10);

  var output = kollavarsham.getYear(year, req.query.lang);

  common.sendAppropriateResponse(req, res, output);
});

yearRouter.use('/years/:year/months', monthRouter);

module.exports = yearRouter;