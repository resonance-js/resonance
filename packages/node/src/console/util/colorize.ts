import { coerceString, isNonNullable } from '@rxify/ts';
import {
    BgColor,
    Style,
    Styles,
    isBgColor,
    isStyle,
    Color,
    isColor
} from '../type';
import { doubleQuote, colon } from './var';

/**
 * Applies a background color and style to `args` when logged to the console.
 * @param bgColor The background color of `args` in the console.
 * @param style The style of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(bgColor: BgColor, ...args: any[]): any[];

/**
 * Applies a background color and style to `args` when logged to the console.
 * @param bgColor The background color of `args` in the console.
 * @param style The style of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(
    color: Color,
    bgColor: BgColor,
    style: Style,
    ...args: any[]
): any[];

/**
 * Applies a background color and style to `args` when logged to the console.
 * @param bgColor The background color of `args` in the console.
 * @param style The style of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(
    color: Color,
    bgColor: BgColor,
    style: Style,
    ...args: any[]
): any[];

/**
 * Applies a color and background to `args` when logged to the console.
 * @param color The color of `args` in the console.
 * @param bgColor The background color of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(color: Color, bgColor: BgColor, ...args: any[]): any[];

/**
 * Applies a color and style to `args` when logged to the console.
 * @param color The color of `args` in the console.
 * @param style The style of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(color: Color, style: Style, ...args: any[]): any[];

/**
 * Applies a color, background color, and style to `args` when logged to the console.
 * @param color The color of `args` in the console.
 * @param bgColor The background color of `args` in the console.
 * @param style The style of `args` in the console.
 * @param args The items to print to the console.
 */
export function colorize(
    color: Color,
    bgColor: BgColor,
    style: Style,
    ...args: any[]
): any[];

export function colorize(...args: (Color | BgColor | Style | any)[]): any[];

export function colorize(...args: (Color | BgColor | Style | any)[]) {
    let color: Color | undefined;
    let bgColor: BgColor | undefined;
    let style: Style | undefined;
    let vals: any[] = [];

    args.forEach((arg) => {
        if (isStyle(arg)) style = arg;
        if (isBgColor(arg)) bgColor = arg;
        if (isColor(arg)) color = arg;
        else vals.push(arg);
    });

    return [color, bgColor, style, ...args, Color.Reset].filter((val) =>
        isNonNullable<any>(val)
    );
}

export function green(message?: any, ...optionalParams: any[]) {
    return colorize(Color.Green, message, ...optionalParams);
}

export function yellow(message?: any, ...optionalParams: any[]) {
    return colorize(Color.Yellow, message, ...optionalParams);
}

export function red(message?: any, ...optionalParams: any[]) {
    return colorize(Color.Red, message, ...optionalParams);
}

export function magenta(message?: any, ...optionalParams: any[]) {
    return colorize(Color.Magenta, message, ...optionalParams);
}

export function cyan(message?: any, ...optionalParams: any[]) {
    return colorize(Color.Cyan, message, ...optionalParams);
}

export function dim(val: string): string {
    return Styles.Dim + val + Color.Reset;
}

export const formatString = (val: string) =>
    doubleQuote + Color.Yellow + val + Color.Reset + doubleQuote;

/**
 *
 * @param key The key of the object to print.
 * @returns
 * * If `key` is not null, `key` wrapped in double quotation marks in {@link Color.Cyan}.
 * * If `key` is null, an empty string.
 * @example
 * formatObjKey(servlet) => '"servlet": '
 * formatObjKey() => ''
 */
export const formatObjKey = (key?: string | number | symbol, level?: number) =>
    formatIndent(level ?? 0) +
    (key
        ? doubleQuote +
          Color.Cyan +
          coerceString(key) +
          Color.Reset +
          doubleQuote +
          colon
        : '');

export const formatNum = (val: number | bigint) =>
    Color.Green + val + Color.Reset;

export const formatBool = (val: boolean) => Color.Blue + val + Color.Reset;

export const formatIndent = (level: number) => new Array(level * 5).join(' ');

export function colorizeVal(
    value: string | number | bigint | boolean | symbol | Function | object
): string {
    switch (typeof value) {
        case 'string':
            return formatString(value);
        case 'number':
            return formatNum(value);
        case 'bigint':
            return formatNum(value);
        case 'boolean':
            return formatBool(value);
        case 'symbol':
            return coerceString(value, value.toString());
        case 'function':
            return value.toString();
        case 'object':
            return JSON.stringify(value);
    }
}
