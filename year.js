'use strict';
var debug = require('debug')('calendar:year'),
  sprintf = require('sprintf-js').sprintf,
  _ = require('lodash'),
  Kollavarsham = require('kollavarsham'),
  kollavarsham = new Kollavarsham();

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

var separator = '-------------------------------------------------------------------------';

var mergeOutputForADay = function (kollavarshamDate, output) {
  var month = monthNames[kollavarshamDate.gregorianDate.getMonth()];
  var date = kollavarshamDate.gregorianDate.getDate();
  var weekdayName = kollavarshamDate.weekdayName;
  var malayalamYear = kollavarshamDate.year;
  var malayalamMonth = kollavarshamDate.globals.malayalaMasa;
  var malayalamDay = kollavarshamDate.day;
  var naksatra = kollavarshamDate.globals.malayalaNaksatra;
  var day = {
    date           : date,
    weekdayName    : weekdayName,
    malayalamYear  : malayalamYear,
    malayalamMonth : malayalamMonth,
    malayalamDay   : malayalamDay,
    naksatra       : naksatra
  };
  if (!output.months) {
    output.months = [];
  }
  if (_.result(_.find(output.months, {'name' : month}), 'name', 'default') === 'default') {
    output.months.push({
      'name' : month,
      'days' : [day]
    });
  } else {
    _.find(output.months, {'name' : month}).days.push(day);
  }
  return output;
};

var getOutputForADay = function (kollavarshamDate) {
  var result = sprintf('| %4s  %-9s  %2s  %-9s | %4s  %5s  %2s | %-13s |',
    kollavarshamDate.gregorianDate.getFullYear(), monthNames[kollavarshamDate.gregorianDate.getMonth()],
    kollavarshamDate.gregorianDate.getDate(), kollavarshamDate.weekdayName, kollavarshamDate.year,
    kollavarshamDate.globals.malayalaMasa, kollavarshamDate.day, kollavarshamDate.globals.malayalaNaksatra);
  return result + '\n' + separator;
};

var year = {
  get : function (req, res) {
    var year = parseInt(req.params.year, 10);

    if (year < 1900 || year > 2050) {
      res.status(400).send({error : 'Invalid arguments'});
      return;
    }

    var gregorianDate = new Date(year, 0, 1);
    var kollavarshamDate, outputText = separator + '\n', output = {year : year};
    while (gregorianDate.getFullYear() === year) {
      kollavarshamDate = kollavarsham.fromGregorianDate(gregorianDate);
      output = mergeOutputForADay(kollavarshamDate, output);
      outputText += getOutputForADay(kollavarshamDate) + '\n';
      gregorianDate.setUTCDate(gregorianDate.getUTCDate() + 1);
    }

    if (req.accepts('text')) {
      res.send(outputText);
      return;
    }

    if (req.accepts('json')) {
      res.send(output);
      return;
    }

    res.type('txt').send(outputText);

  }
};

module.exports = year;