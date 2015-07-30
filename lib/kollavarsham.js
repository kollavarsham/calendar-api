'use strict';

var debug = require('debug')('calendar:kollavarsham'),
  sprintf = require('sprintf-js').sprintf,
  _ = require('lodash'),
  Kollavarsham = require('kollavarsham'),
  kollavarsham = new Kollavarsham();

var separator = '-------------------------------------------------------------------------';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var getCalendarDay = function (kollavarshamDate, useMalayalam) {
  var gregorianDate = kollavarshamDate.gregorianDate;
  var day = {
    year           : gregorianDate.getFullYear(),
    month          : monthNames[gregorianDate.getMonth()],
    date           : gregorianDate.getDate(),
    weekdayName    : kollavarshamDate.weekdayName,
    malayalamYear  : kollavarshamDate.year,
    malayalamMonth : kollavarshamDate.globals.malayalaMasa,
    malayalamDay   : kollavarshamDate.day,
    naksatra       : kollavarshamDate.globals.malayalaNaksatra
  };
  if (useMalayalam) {
    day.weekdayName = kollavarshamDate.mlWeekdayName;
    day.malayalamMonth = kollavarshamDate.globals.mlMalayalaMasa;
    day.naksatra = kollavarshamDate.globals.mlMalayalaNaksatra;
  }
  return day;
};

var mergeJSON = function (calendarDay, output) {
  var month = calendarDay.month;
  if (!output.months) {
    output.months = [];
  }
  if (_.result(_.find(output.months, {'name' : month}), 'name', 'default') === 'default') {
    output.months.push({
      'name' : month,
      'days' : [calendarDay]
    });
  } else {
    _.find(output.months, {'name' : month}).days.push(calendarDay);
  }
  return output;
};

var mergeText = function (calendarDay) {
  var result = sprintf('| %4s  %-9s  %2s  %-9s | %4s  %5s  %2s | %-13s |',
    calendarDay.year, calendarDay.month, calendarDay.date, calendarDay.weekdayName, calendarDay.malayalamYear,
    calendarDay.malayalamMonth, calendarDay.malayalamDay, calendarDay.naksatra);
  return result + '\n' + separator;
};

function convertGregorianDays(startDate, jsonOutput, untilDateCallback, lang) {
  var textOutput = separator + '\n';

  while (untilDateCallback(startDate)) {
    var calendarDay = getCalendarDay(kollavarsham.fromGregorianDate(startDate), lang === 'ml');
    jsonOutput = mergeJSON(calendarDay, jsonOutput);
    textOutput += mergeText(calendarDay) + '\n';
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }

  return {text : textOutput, json : jsonOutput};
}

module.exports = {
  getYear  : function (year, lang) {
    lang = lang || 'en';
    debug('Within getYear with year: %d', year);

    var initialJSONOutput = {year : year};

    var untilYearMatches = function (currentDate) {
      return currentDate.getFullYear() === year;
    };

    return convertGregorianDays(new Date(year, 0, 1), initialJSONOutput, untilYearMatches, lang);
  },
  getMonth : function (year, month, lang) {
    lang = lang || 'en';
    debug('Within getMonth with year: %d and month: %d', year, month);

    var initialJSONOutput = {
      year   : year,
      months : [{'name' : monthNames[month], 'days' : []}]
    };

    var untilYearAndMonthMatches = function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month;
    };

    return convertGregorianDays(new Date(year, month, 1), initialJSONOutput, untilYearAndMonthMatches, lang);
  }
};