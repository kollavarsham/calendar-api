'use strict';

var debug = require('debug')('calendar:kollavarsham'),
  sprintf = require('sprintf-js').sprintf,
  _ = require('lodash'),
  Kollavarsham = require('kollavarsham'),
  kollavarsham = new Kollavarsham();

var separator = '-------------------------------------------------------------------------';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

var mergeJSONOutputForADay = function (kollavarshamDate, output) {
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

var mergeTextOutputForADay = function (kollavarshamDate) {
  var result = sprintf('| %4s  %-9s  %2s  %-9s | %4s  %5s  %2s | %-13s |',
    kollavarshamDate.gregorianDate.getFullYear(), monthNames[kollavarshamDate.gregorianDate.getMonth()],
    kollavarshamDate.gregorianDate.getDate(), kollavarshamDate.weekdayName, kollavarshamDate.year,
    kollavarshamDate.globals.malayalaMasa, kollavarshamDate.day, kollavarshamDate.globals.malayalaNaksatra);
  return result + '\n' + separator;
};

function collateKollavarshamDates(startDate, initialOutput, collateDateUntil) {
  var kollavarshamDate, outputText = separator + '\n';
  while (collateDateUntil(startDate)) {
    kollavarshamDate = kollavarsham.fromGregorianDate(startDate);
    initialOutput = mergeJSONOutputForADay(kollavarshamDate, initialOutput);
    outputText += mergeTextOutputForADay(kollavarshamDate) + '\n';
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  return {text : outputText, json : initialOutput};
}

module.exports = {
  getYear  : function (year) {
    debug('Within getYear with year: %d', year);
    return collateKollavarshamDates(new Date(year, 0, 1), {year : year}, function (currentDate) {
      return currentDate.getFullYear() === year;
    });
  },
  getMonth : function (year, month) {
    debug('Within getMonth with year: %d and month: %d', year, month);
    return collateKollavarshamDates(new Date(year, month, 1), {
      year   : year,
      months : [{'name' : monthNames[month], 'days' : []}]
    }, function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month;
    });
  }
};