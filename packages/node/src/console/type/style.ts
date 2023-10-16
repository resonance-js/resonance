import { isNonNullable } from '@rxify/ts';

/**
 * Console text styles.
 */
export declare type Style =
    | '\x1b[1m'
    | '\x1b[2m'
    | '\x1b[4m'
    | '\x1b[5m'
    | '\x1b[7m'
    | '\x1b[8m';

/**
 * Determines if val is a Style.
 * @param val Is Style or unkown.
 * @returns True if val is a Style; otherwise, false.
 */
export const isStyle = (val: unknown): val is Style =>
    isNonNullable<Style> &&
    (val === '\x1b[1m' ||
        val === '\x1b[2m' ||
        val === '\x1b[4m' ||
        val === '\x1b[5m' ||
        val === '\x1b[7m' ||
        val === '\x1b[8m');

/**
 * Console text styles.
 */
export namespace Styles {
    export const Bright = '\x1b[1m',
        Dim = '\x1b[2m',
        Underscore = '\x1b[4m',
        Blink = '\x1b[5m',
        Reverse = '\x1b[7m',
        Hidden = '\x1b[8m';
}
