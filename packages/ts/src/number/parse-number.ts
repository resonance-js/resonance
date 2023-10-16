import { stringify } from '../string/stringify';

export function parseNumber(val: any): number;

export function parseNumber(
    val: any,
    options?: {
        /** If numbers should be converted to strings. Defaults to true. */
        stringifyNumber?: boolean;

        /** If an object, if it should be wrapped in quotation marks. Defaults to false. */
        quoteObjString?: boolean;
    }
): number | string;

export function parseNumber(
    val: any,
    options: {
        /** If numbers should be converted to strings. Defaults to true. */
        stringifyNumber: true;

        /** If an object, if it should be wrapped in quotation marks. Defaults to false. */
        quoteObjString?: boolean;
    }
): string;

/**
 * Transforms an input value into a number. If `value` is an object,
 * calls `JSON.stringify(value)`. If `JSON.stringify` fails,
 * @param value The value to coerce into a string.
 * @returns A string representation of `value`.
 */
export function parseNumber(
    value: any,
    options?: {
        /** If numbers should be converted to strings. Defaults to true. */
        stringifyNumber?: boolean;

        /** If an object, if it should be wrapped in quotation marks. Defaults to false. */
        quoteObjString?: boolean;
    }
): string | number {
    return typeof value === 'string' ||
        (typeof value === 'number' &&
            (options?.stringifyNumber ?? true) === false)
        ? value
        : typeof value === 'object'
        ? options?.quoteObjString
            ? '"' + stringify(value) + '"'
            : stringify(value)
        : String(value);
}
