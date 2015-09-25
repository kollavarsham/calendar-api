'use strict';

var debug = require('debug')('calendar:kollavarsham'),
  sprintf = require('sprintf-js').sprintf,
  _ = require('lodash'),
  Kollavarsham = require('kollavarsham'),
  kollavarsham = new Kollavarsham();

var separator = '---------------------------------------------------------------------------------------------------------';

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* jshint -W100 */
var mlMonthNames = ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്‌', 'ഏപ്രിൽ ', 'മെയ്‌', 'ജൂണ്‍', 'ജൂലൈ', 'ഓഗസ്റ്റ്‌', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'];
/* jshint +W100 */

var getCalendarDay = function (kollavarshamDate, useMalayalam) {
  var gregorianDate = kollavarshamDate.gregorianDate;
  var day = {
    year           : gregorianDate.getFullYear(),
    month          : monthNames[gregorianDate.getMonth()],
    mlMonth        : mlMonthNames[gregorianDate.getMonth()],
    date           : gregorianDate.getDate(),
    weekdayName    : kollavarshamDate.weekdayName,
    malayalamYear  : kollavarshamDate.year,
    malayalamMonth : kollavarshamDate.masaName,
    malayalamDay   : kollavarshamDate.date,
    naksatra       : kollavarshamDate.naksatraName,
    paksa          : kollavarshamDate.sakaDate.paksa,
    tithi          : kollavarshamDate.sakaDate.tithi
  };
  if (useMalayalam) {
    day.weekdayName = kollavarshamDate.mlWeekdayName;
    day.malayalamMonth = kollavarshamDate.mlMasaName;
    day.naksatra = kollavarshamDate.mlNaksatraName;
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
  var result = sprintf('| %4s  %-9s (%s)  %2s  %-10s | %4s  %10s  %2s | %-14s | %-10s | %2s |',
    calendarDay.year, calendarDay.month, calendarDay.mlMonth, calendarDay.date, calendarDay.weekdayName,
    calendarDay.malayalamYear, calendarDay.malayalamMonth, calendarDay.malayalamDay, calendarDay.naksatra,
    calendarDay.paksa, calendarDay.tithi);
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

    var untilYearAndMonthMatch = function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month;
    };

    return convertGregorianDays(new Date(year, month, 1), initialJSONOutput, untilYearAndMonthMatch, lang);
  },
  getDay   : function (year, month, day, lang) {
    lang = lang || 'en';
    debug('Within getDay with year: %d, month: %d and day: %d', year, month, day);

    var initialJSONOutput = {
      year   : year,
      months : [{'name' : monthNames[month], 'days' : []}]
    };

    var untilYearMonthAndDayMatch = function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month && currentDate.getDate() === day;
    };

    return convertGregorianDays(new Date(year, month, day), initialJSONOutput, untilYearMonthAndDayMatch, lang);
  }
};