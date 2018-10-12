import {
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfYear,
    endOfYear,
    addYears,
    isSameDay,
    format
} from 'date-fns';

// requires jquery-calendars plugin
const $ = window.$;
const jQuery = window.jQuery;

const nepaliCalendar = jQuery.calendars.instance('nepali', 'ne')



export const toDateString = function(date) {
    return format(date, "YYYY-MM-DD")
}
  
// last 3 months
// remove this month

const defineds = {
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfYear: startOfYear(new Date()),
    endOfYear: endOfYear(new Date()),

    startOfLastThreeMonths: startOfMonth(addMonths(new Date(), -3)),
    endOfLastThreeMonths: endOfMonth(addMonths(new Date(), -1)),

    startOfLastSixMonths: startOfMonth(addMonths(new Date(), -6)),
    endOfLastSixMonths: endOfMonth(addMonths(new Date(), -1)),
    startOfLastTwelveMonths: startOfMonth(addMonths(new Date(), -12)),
    endOfLastTwelveMonths: endOfMonth(addMonths(new Date(), -1)),

    startOfLastYear: startOfYear(addYears(new Date(), -1)),
    endOfLastYear: endOfYear(addYears(new Date(), -1)),

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
    {
        label: 'Last Year',
        range: () => ({
            startDate: defineds.startOfLastYear,
            endDate: defineds.endOfLastYear,
        }),
    },
].map((range) => {return {...range, rangeDate: () => { var r = range.range(); return {
    startDate: englishToNepali(r.startDate), endDate: englishToNepali(r.endDate)}}}});


export const compareDates = function(date1, date2) {
    return isSameDay(new Date(date1), new Date(date2))
}

const nepaliMonths = ['', 'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Paush', 'Mangh', 'Falgun', 'Chaitra'];
export const humanizedNepali = function (yyyymm) {
    return nepaliMonths[parseInt(yyyymm.substring(4, 6), 10)] + " " + yyyymm.substring(0, 4);
}

export const nepaliToEnglish = function (nepaliDate) {
    // nepaliDate = dd/mm/yyyy
    console.log(nepaliDate)
    var date = nepaliDate.split('/');
    var year = parseInt(date[2], 10);
    var month = parseInt(date[1], 10);
    var day = parseInt(date[0], 10); 
    return toDateString(nepaliCalendar.toJSDate(year, month, day));
}

export const englishToNepali = function (englishDate) {
    return nepaliCalendar.fromJSDate(englishDate).formatDate("dd/mm/yyyy");
}