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

var validateDay = function (req, res, next) {
  var errorMessage = '';

  var year = req.params.year;
  var month = req.params.month;
  var day = req.params.day;

  if (!utils.isNumeric(day)) {
    errorMessage = '\'day\' should be numeric';
  }

  if (!errorMessage && !utils.isInteger(day)) {
    errorMessage = '\'day\' should be an integer';
  }

  year = parseInt(year, 10);
  month = parseInt(month, 10);
  day = parseInt(day, 10);

  if (!errorMessage && day < 1 || day > 31) {
    errorMessage = '\'day\' is not within the permitted range';
  }

  var date = new Date(year, month - 1, day);

  if (!errorMessage && (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)) {
    errorMessage = '\'day\' is not valid for the \'year\' and \'month\'';
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
module.exports.validateDay = validateDay;