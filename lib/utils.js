'use strict';

var utils = {
  isNumeric : function (possibleNumber) {
    return !isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber);
  },
  isInteger: function(possibleInteger) {
    return !isNaN(possibleInteger) && (function(x) { return (x | 0) === x; })(parseFloat(possibleInteger));
  }
};

module.exports = utils;