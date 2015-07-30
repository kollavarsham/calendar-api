'use strict';

var debug = require('debug')('calendar:validators'),
  utils = require('./utils');

var validateYear = function (req, res, next) {
  var errorMessage = '';

  var year = req.params.year;

  if (!utils.isNumeric(year)) {
    errorMessage = '\'year\' should be numeric';
  }

  if (!errorMessage && !utils.isInteger(year)) {
    errorMessage = '\'year\' should be an integer';
  }

  year = parseInt(year, 10);

  if (!errorMessage && year < 1900 || year > 2050) {
    errorMessage = '\'year\' is not within the permitted range';
  }

  if (errorMessage) {
    debug(errorMessage);
    res.status(400).send({error : errorMessage});
    return;
  }

  next();
};

var validateMonth = function (req, res, next) {
  var errorMessage = '';

  var month = req.params.month;

  if (!utils.isNumeric(month)) {
    errorMessage = '\'month\' should be numeric';
  }

  if (!errorMessage && !utils.isInteger(month)) {
    errorMessage = '\'month\' should be an integer';
  }

  month = parseInt(month, 10);

  if (!errorMessage && month < 1 || month > 12) {
    errorMessage = '\'month\' is not within the permitted range';
  }

  if (errorMessage) {
    debug(errorMessage);
    res.status(400).send({error : errorMessage});
    return;
  }

  next();
};

module.exports.validateYear = validateYear;
module.exports.validateMonth = validateMonth;