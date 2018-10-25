import {format} from 'date-fns';

import {
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfYear,
    endOfYear,
    startOfFiscalYear,
    endOfFiscalYear,
    addYears,
    isSameDay,
    todayNepali,
    formatNepaliDate
} from './NepaliDateUtils';

const jQuery = window.jQuery;

const nepaliCalendar = jQuery.calendars.instance('nepali', 'ne')



export const toDateString = function(date) {
    return format(date, "YYYY-MM-DD")
}
  
// last 3 months
// remove this month

console.log(todayNepali())
console.log(addMonths(todayNepali(), -12))

// console.log(startOfMonth(addMonths(todayNepali(), -12)))
// console.log(startOfMonth(addMonths(todayNepali(), -1)))

const defineds = {
    startOfMonth: startOfMonth(todayNepali()),
    endOfMonth: endOfMonth(todayNepali()),
    startOfYear: startOfYear(todayNepali()),
    endOfYear: endOfYear(todayNepali()),

    startOfLastThreeMonths: startOfMonth(addMonths(todayNepali(), -3)),
    endOfLastThreeMonths: endOfMonth(addMonths(todayNepali(), -1)),

    startOfLastSixMonths: startOfMonth(addMonths(todayNepali(), -6)),
    endOfLastSixMonths: endOfMonth(addMonths(todayNepali(), -1)),
    startOfLastTwelveMonths: startOfMonth(addMonths(todayNepali(), -12)),
    endOfLastTwelveMonths: endOfMonth(addMonths(todayNepali(), -1)),

    startOfLastYear: startOfYear(addYears(todayNepali(), -1)),
    endOfLastYear: endOfYear(addYears(todayNepali(), -1)),

    startOfLastFiscalYear: startOfFiscalYear(addYears(todayNepali(), -1)),
    endOfLastFiscalYear: endOfFiscalYear(addYears(todayNepali(), -1)),

};



export const defaultStaticRanges = [
    {
        label: 'Last 3 Months',
        range: () => ({
            startDate: defineds.startOfLastThreeMonths,
            endDate: defineds.endOfLastThreeMonths,
        }),
    },
    {
        label: 'Last 12 Months',
        range: () => ({
            startDate: defineds.startOfLastTwelveMonths,
            endDate: defineds.endOfLastTwelveMonths,
        }),
    },
    // {
    //     label: 'Last Year',
    //     range: () => ({
    //         startDate: defineds.startOfLastYear,
    //         endDate: defineds.endOfLastYear,
    //     }),
    // },
    {
        label: 'Last Fiscal Year',
        range: () => ({
            startDate: defineds.startOfLastFiscalYear,
            endDate: defineds.endOfLastFiscalYear,
        }),
    },
].map((range) => {return {...range, rangeDate: () => { var r = range.range(); return {
    startDate: formatNepaliDate(r.startDate), endDate: formatNepaliDate(r.endDate)}}}});


export const compareDates = function(date1, date2) {
    return isSameDay(new Date(date1), new Date(date2))
}

const nepaliMonths = ['', 'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Paush', 'Mangh', 'Falgun', 'Chaitra'];
export const humanizedNepali = function (yyyymm) {
    return nepaliMonths[parseInt(yyyymm.substring(4, 6), 10)] + " " + yyyymm.substring(0, 4);
}

export const nepaliToEnglish = function (nepaliDate) {
    // nepaliDate = dd/mm/yyyy
    var date = nepaliDate.split('/');
    var year = parseInt(date[2], 10);
    var month = parseInt(date[1], 10);
    var day = parseInt(date[0], 10); 
    return toDateString(nepaliCalendar.toJSDate(year, month, day));
}

export const englishToNepali = function (englishDate) {
    return nepaliCalendar.fromJSDate(englishDate).formatDate("dd/mm/yyyy");
}