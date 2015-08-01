'use strict';

var debug = require('debug')('calendar:validators');

var isNumeric = function (possibleNumber) {
  return !isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber);
};

var isInteger = function (possibleInteger) {
  return !isNaN(possibleInteger) && (function (x) { return (x | 0) === x; })(parseFloat(possibleInteger));
};

var isIntegerWithinBounds = function (field, fieldName, lowerBound, upperBound) {
  var errorMessage = '';

  if (!isNumeric(field)) {
    errorMessage = fieldName + ' should be numeric';
  }

  if (!errorMessage && !isInteger(field)) {
    errorMessage = fieldName + ' should be an integer';
  }

  field = parseInt(field, 10);

  if (!errorMessage && field < lowerBound || field > upperBound) {
    errorMessage = fieldName + ' is not within the permitted range';
  }
  return errorMessage;
};

var respondWithErrorOrCallNext = function (errorMessage, res, next) {
  if (errorMessage) {
    debug(errorMessage);
    res.status(400).send({error : errorMessage});
    return;
  }
  next();
};

var validators = {
  validateYear  : function (req, res, next) {
    respondWithErrorOrCallNext(isIntegerWithinBounds(req.params.year, '\'year\'', 1900, 2050), res, next);
  },
  validateMonth : function (req, res, next) {
    respondWithErrorOrCallNext(isIntegerWithinBounds(req.params.month, '\'month\'', 1, 12), res, next);
  },
  validateDay   : function (req, res, next) {
    var errorMessage = isIntegerWithinBounds(req.params.day, '\'day\'', 1, 31);

    var year = parseInt(req.params.year, 10);
    var month = parseInt(req.params.month, 10);
    var day = parseInt(req.params.day, 10);

    var date = new Date(year, month - 1, day);

    if (!errorMessage && (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)) {
      errorMessage = '\'day\' is not valid for the \'year\' and \'month\'';
    }

    respondWithErrorOrCallNext(errorMessage, res, next);
  }
};

module.exports = validators;