import { isNonNullable } from '@rxify/ts';

/**
 * Console background colors.
 */
export declare type BgColor =
    | '\x1b[40m'
    | '\x1b[41m'
    | '\x1b[42m'
    | '\x1b[43m'
    | '\x1b[44m'
    | '\x1b[45m'
    | '\x1b[46m'
    | '\x1b[47m'
    | '\x1b[100m';

/**
 * Determines if val is a BgColor.
 * @param val Is BgColor or unkown.
 * @returns True if val is a BgColor; otherwise, false.
 */
export const isBgColor = (val: unknown): val is BgColor =>
    isNonNullable(val) &&
    (val === '\x1b[40m' ||
        val === '\x1b[41m' ||
        val === '\x1b[42m' ||
        val === '\x1b[43m' ||
        val === '\x1b[44m' ||
        val === '\x1b[45m' ||
        val === '\x1b[46m' ||
        val === '\x1b[47m' ||
        val === '\x1b[100m');

/**
 * Console background colors.
 */
export namespace BgColor {
    export const Black: BgColor = '\x1b[40m',
        Red: BgColor = '\x1b[41m',
        Green: BgColor = '\x1b[42m',
        Yellow: BgColor = '\x1b[43m',
        Blue: BgColor = '\x1b[44m',
        Magenta: BgColor = '\x1b[45m',
        Cyan: BgColor = '\x1b[46m',
        White: BgColor = '\x1b[47m',
        Gray: BgColor = '\x1b[100m';
}
