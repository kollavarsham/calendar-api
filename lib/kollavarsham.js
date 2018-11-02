'use strict';

const debug = require('debug')('calendar:kollavarsham');
const sPrintF = require('sprintf-js').sprintf;
const _ = require('lodash');
const Kollavarsham = require('kollavarsham');
const kollavarsham = new Kollavarsham();

const separator = '---------------------------------------------------------------------------------------------------------';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const mlMonthNames = ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്‌', 'ഏപ്രിൽ ', 'മെയ്‌', 'ജൂണ്‍', 'ജൂലൈ', 'ഓഗസ്റ്റ്‌', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ']; // jshint ignore:line

const getCalendarDay = function (kollavarshamDate, useMalayalam) {
  const gregorianDate = kollavarshamDate.gregorianDate;
  const day = {
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

const mergeJSON = function (calendarDay, output) {
  const month = calendarDay.month;
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

const mergeText = function (calendarDay) {
  const result = sPrintF('| %4s  %-9s (%s)  %2s  %-10s | %4s  %10s  %2s | %-14s | %-10s | %2s |',
    calendarDay.year, calendarDay.month, calendarDay.mlMonth, calendarDay.date, calendarDay.weekdayName,
    calendarDay.malayalamYear, calendarDay.malayalamMonth, calendarDay.malayalamDay, calendarDay.naksatra,
    calendarDay.paksa, calendarDay.tithi);
  return result + '\n' + separator;
};

const convertGregorianDays = function (startDate, jsonOutput, untilDateCallback, lang) {
  let textOutput = separator + '\n';

  while (untilDateCallback(startDate)) {
    const calendarDay = getCalendarDay(kollavarsham.fromGregorianDate(startDate), lang === 'ml');
    jsonOutput = mergeJSON(calendarDay, jsonOutput);
    textOutput += mergeText(calendarDay) + '\n';
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }

  return {text : textOutput, json : jsonOutput};
};

module.exports = {
  getYear  : function (year, lang) {
    lang = lang || 'en';
    debug('Within getYear with year: %d', year);

    const initialJSONOutput = {year : year};

    const untilYearMatches = function (currentDate) {
      return currentDate.getFullYear() === year;
    };

    return convertGregorianDays(new Date(year, 0, 1), initialJSONOutput, untilYearMatches, lang);
  },
  getMonth : function (year, month, lang) {
    lang = lang || 'en';
    debug('Within getMonth with year: %d and month: %d', year, month);

    const initialJSONOutput = {
      year   : year,
      months : [{'name' : monthNames[month], 'days' : []}]
    };

    const untilYearAndMonthMatch = function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month;
    };

    return convertGregorianDays(new Date(year, month, 1), initialJSONOutput, untilYearAndMonthMatch, lang);
  },
  getDay   : function (year, month, day, lang) {
    lang = lang || 'en';
    debug('Within getDay with year: %d, month: %d and day: %d', year, month, day);

    const initialJSONOutput = {
      year   : year,
      months : [{'name' : monthNames[month], 'days' : []}]
    };

    const untilYearMonthAndDayMatch = function (currentDate) {
      return currentDate.getFullYear() === year && currentDate.getMonth() === month && currentDate.getDate() === day;
    };

    return convertGregorianDays(new Date(year, month, day), initialJSONOutput, untilYearMonthAndDayMatch, lang);
  }
};