import { ad2bs, getDaysInMonth } from "./BikramSambatConverter";

export function todayNepali() {
    let todayEnglish = new Date();
    return ad2bs(
        todayEnglish.getFullYear(),
        todayEnglish.getMonth() + 1,
        todayEnglish.getDate()
    )
}

export function startOfMonth(nepaliDate) {
    return { ...nepaliDate, date: 1 }
}

export function startOfYear(nepaliDate) {
    return { ...nepaliDate, date: 1, month: 1 }
}

export function startOfFiscalYear(nepaliDate) {
    let yearOffset = nepaliDate.month >= 4 ? 0 : - 1;
    return { year: nepaliDate.year + yearOffset, month: 4, date: 1 }
}

export function endOfFiscalYear(nepaliDate) {
    let yearOffset = nepaliDate.month > 3 ? 1 : 0;
    return { year: nepaliDate.year + yearOffset, month: 3, date: getDaysInMonth(nepaliDate.year + yearOffset, 3) }
}


export function endOfYear(nepaliDate) {
    return { ...nepaliDate, month: 12, date: getDaysInMonth(nepaliDate.year, 12) }
}

export function endOfMonth(nepaliDate) {
    return { ...nepaliDate, date: getDaysInMonth(nepaliDate.year, nepaliDate.month) }
}

export function addMonths(nepaliDate, months) {
    let desiredMonth = (nepaliDate.month + months);
    let resultingYear = nepaliDate.year;
    while (desiredMonth > 12) {
        desiredMonth -= 12;
        resultingYear += 1;
    }
    while (desiredMonth < 1) {
        desiredMonth += 12;
        resultingYear -= 1;
    }
    desiredMonth = desiredMonth < 1 ? 12 + desiredMonth : desiredMonth % 12;
    let newDate = Math.min(nepaliDate.date, getDaysInMonth(resultingYear, desiredMonth));
    return {year: resultingYear, month: desiredMonth, date: newDate }
}

export function addYears(nepaliDate, years) {
    let desiredYear = (nepaliDate.year + years)
    let newDate = Math.min(nepaliDate.date, getDaysInMonth(desiredYear, nepaliDate.month));
    return { ...nepaliDate, year: desiredYear, date: newDate }
}

export function isSameDay(date1, date2) {
    return date1.year === date2.year && date1.month === date2.month && date1.date === date2.date;
}

export function formatNepaliDate(nepaliDate) {
    return nepaliDate.date + "/" + nepaliDate.month + "/" + nepaliDate.year;
}