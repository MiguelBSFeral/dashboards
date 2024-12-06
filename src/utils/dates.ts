import {isValid, format, differenceInSeconds} from 'date-fns';

const dateUtils = {
    formatDate: function(date?: string | Date, fallbackValue: Date = new Date()): string {
        const fullDateFormat = "dd-MM-yyyy HH:mm:ss";
        return date != null && isValid(new Date(date))
            ? format(new Date(date), fullDateFormat)
            : format(fallbackValue, fullDateFormat);
    },
    addHours: function(date: Date, hours: number): Date {
        const result = new Date(date);
        result.setTime(result.getTime() + hours * 60 * 60 * 1000);
        return result;
    },
    subtractDays: function(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    },
    getSecondsBetweenDates: function(startDate: Date, endDate: Date): number {
        return differenceInSeconds(endDate, startDate);
    },
    getDayOfWeek: function(dateStr: string): number {
        const date = new Date(dateStr);
        return date.getDay();
    }
};

export default dateUtils;
