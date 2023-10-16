import { makeTwoDigits, round } from '../number';
import { joinWith } from '../string';
import { isNonNullable } from '../type';

export declare type Day = 'dd' | 'd';
export declare type Month = 'mm' | 'm';
export declare type Year = 'yyyy' | 'yy';

export declare type DateFragment = Day | Month | Year;

export declare type Hours = 'HH' | 'H';
export declare type Minutes = 'MM' | 'M';
export declare type Seconds = 'SS' | 'S';
export declare type Milliseconds = 'ms' | 'mss' | 'msss';
export declare type AmPm = 'a';

export declare type TimeFragment =
    | Hours
    | Minutes
    | Seconds
    | Milliseconds
    | AmPm;

export declare type DateTimeFragment = DateFragment | TimeFragment;

export declare type DateTimeSplitter = ':' | ', ' | '/' | ' ';

export const fullDate = joinWith('/');

export declare type FullDate = ['dd' | 'd' | 'm' | 'mm'];

function formatDate12Hours(hours: number): {
    amPm: 'AM' | 'PM';
    hours: number;
} {
    const amPm = hours < 12 ? 'AM' : 'PM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
        amPm,
        hours
    };
}

export function formatDate(date: Date, ...format: DateTimeFragment[]) {
    const amPm = format.includes('a');

    let amOrPm: 'AM' | 'PM' | undefined;

    const seperators: ('D' | 'T' | 'A')[] = [];

    const formattedFragments = format
        .map((fragment) => {
            switch (fragment) {
                case 'H':
                    seperators.push('T');
                    if (amPm) {
                        const hours = formatDate12Hours(date.getHours());
                        amOrPm = hours.amPm;
                        return hours.hours;
                    } else {
                        return date.getHours();
                    }
                case 'HH':
                    seperators.push('T');
                    if (amPm) {
                        const hours = formatDate12Hours(date.getHours());
                        amOrPm = hours.amPm;
                        return makeTwoDigits(hours.hours);
                    } else {
                        return makeTwoDigits(date.getHours());
                    }
                case 'M':
                    seperators.push('T');
                    return date.getMinutes();
                case 'MM':
                    seperators.push('T');
                    return makeTwoDigits(date.getMinutes());
                case 'S':
                    seperators.push('T');
                    return date.getSeconds();
                case 'SS':
                    seperators.push('T');
                    return makeTwoDigits(date.getSeconds());
                case 'ms':
                    seperators.push('T');
                    return round(date.getMilliseconds(), 1);
                case 'mss':
                    seperators.push('T');
                    return round(date.getMilliseconds(), 2);
                case 'msss':
                    seperators.push('T');
                    return round(date.getMilliseconds(), 3);
                case 'd':
                    seperators.push('D');
                    return date.getDate();
                case 'dd':
                    seperators.push('D');
                    return makeTwoDigits(date.getDate());
                case 'm':
                    seperators.push('D');
                    return date.getMonth();
                case 'mm':
                    seperators.push('D');
                    return makeTwoDigits(date.getMonth());
                case 'yy':
                    seperators.push('D');
                    return String(date.getFullYear()).substring(2, 3);
                case 'yyyy':
                    seperators.push('D');
                    return date.getFullYear();
                case 'a':
                    seperators.push('A');
                    return isNonNullable<boolean>(amPm) ? amOrPm : null;
                default:
                    return null;
            }
        })
        .filter((dateFragment) =>
            isNonNullable<string | number>(dateFragment)
        ) as (string | number)[];

    let timeString = '';

    for (let i = 0; i < formattedFragments.length; i++) {
        const thisSeparator = seperators[i];
        const nextSeparator = seperators[i + 1];

        if (thisSeparator === 'D' && nextSeparator === 'D') {
            timeString = timeString + formattedFragments[i] + '/';
        } else if (thisSeparator === 'T' && nextSeparator === 'T') {
            timeString = timeString + formattedFragments[i] + ':';
        } else if (
            (thisSeparator === 'D' && nextSeparator === 'T') ||
            (thisSeparator === 'T' && nextSeparator === 'D')
        ) {
            timeString = timeString + formattedFragments[i] + ', ';
        } else if (nextSeparator === 'A') {
            timeString = timeString + formattedFragments[i] + ' ';
        } else {
            timeString = timeString + formattedFragments[i];
        }
    }

    return timeString;
}

formatDate(new Date(), 'HH', 'MM', 'SS');
