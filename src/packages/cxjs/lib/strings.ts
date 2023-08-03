export function formatCamelCase(text: string) {
    const sentenceCase = text.replace(/([A-Z])/g, '$1').trim();
    return sentenceCase.charAt(0).toLowerCase() + sentenceCase.slice(1);
}

/**
 * Formats a dash-delimited string as camel case.
 * @param text The string to manipulate.
 * @returns A string with dashes removed and text following dashes converted to upper-case.
 */
export function dashToCamelCase(text: string) {
    const cc = squish(
        ...text
            .split('-')
            .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
    );

    return cc.charAt(0).toLowerCase() + cc.slice(1);
}

/**
 * Calls the JSON.stringify method and catches errors.
 * @param value The object to be transformed into a string.
 * @param options Optional parameters for the stringify method.
 * @returns A string representation of the object or an empty string.
 */
export function stringify(
    value: object,
    options?: {
        returnStringObjectOnError?: boolean;
        printError?: boolean;
    }
): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        if (options) {
            if (options.printError) {
                console.error(error);
            }
            if (options.returnStringObjectOnError) {
                return String(value);
            } else {
                return '';
            }
        }
        return '';
    }
}

export const escape = (value: string): string =>
    value.replace(/\//g, '').replace(/\./g, '');

/**
 * Transforms an input value into a number. If `value` is an object,
 * calls `JSON.stringify(value)`. If `JSON.stringify` fails,
 * @param value The value to coerce into a string.
 * @returns A string representation of `value`.
 */
export const coerceString = (
    value: any,
    options?: {
        /** If numbers should be converted to strings. Defaults to true. */
        stringifyNumber?: boolean;

        /** If an object, if it should be wrapped in quotation marks. Defaults to false. */
        quoteObjString?: boolean;
    }
): string | number =>
    typeof value === 'string' ||
    (typeof value === 'number' && (options?.stringifyNumber ?? true) === false)
        ? value
        : typeof value === 'object'
        ? options?.quoteObjString
            ? quote(stringify(value))
            : stringify(value)
        : String(value);

/**
 * @param str The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const quote = (str: string | number | symbol): string =>
    '"' + coerceString(str) + '"';

/**
 * @param str The string to be modified.
 * @returns A string wrapped in double quotation marks.
 */
export const singleQuote = (str: string | number | symbol): string =>
    `'` + coerceString(str) + `'`;

/**
 * @param str The string to be modified.
 * @returns A string wrapped in parenthesis.
 */
export const wrap = (str: string | number | symbol): string =>
    '(' + coerceString(str) + ')';

/**
 * @param str The string to be modified.
 * @returns A string wrapped in brackets.
 */
export const bracket = (str: string | number | symbol): string =>
    '[' + coerceString(str) + ']';

/**
 * @param str The string to be modified.
 * @returns A string wrapped in `\\b`.
 */
export const boundaries = (str: string | number | symbol): string =>
    '\\b' + coerceString(str) + '\\b';

/**
 * Delimits an array of values with spaces.
 * @param str Strings to be delimited.
 * @returns Stringified array delimited with spaces.
 */
export const join = (...str: (string | number | symbol)[]): string =>
    str.map((s) => coerceString(s)).join(' ');

/**
 * Joins strings with and.
 * @param str The strings to join.
 * @returns String, seperated by commas, where and is inserted where necessary.
 */
export function joinAnd(...str: (string | number)[]): string {
    switch (str.length) {
        case 1:
            return coerceString(str[0]) + '';
        case 2:
            return str[0] + ' and ' + str[1];
        default:
            const finalWord = str.pop();
            return [...str, 'and ' + finalWord].join(', ');
    }
}

/**
 * Joins together an array of values without spaces.
 * @param str Strings to be delimited.
 * @returns Stringified array whose values should be joined.
 */
export const squish = (...str: (string | number | symbol)[]): string =>
    str.map((s) => coerceString(s)).join('');

/**
 * Delimits an array of values with `comma + space`.
 * @param str Strings to be delimited.
 * @returns Stringified array delimited with `comma + space`.
 */
export const flatList = (...str: (string | number | symbol)[]): string =>
    str.map((s) => coerceString(s)).join(', ');

/**
 *
 * @param str Strings to be delimited.
 * @returns Stringified array delimited with `- + listItem + \n`
 */
export const list = (...str: (string | number | symbol)[]): string =>
    str.map((s) => join('\t-', s)).join('\n');

/**
 * Delimits an array of values with `\n`.
 * @param str Strings to be delimited.
 * @returns Stringified array delimited with `\n`.
 */
export const newLine = (...str: (string | number | symbol)[]): string =>
    str.map((s) => coerceString(s)).join('\n');

/**
 * Delimits an array of values with a custom delimiter.
 * @param delimiter The joining character(s) - i.e. `', '`, `\n`.
 * @param str Strings to be delimited.
 * @returns Stringified array delimited with custom delimiter.
 */
export const joinWith = (
    delimiter: string,
    ...str: (string | number | symbol)[]
) => str.map<string | number>((s) => coerceString(s)).join(delimiter);

/**
 * Ripped from the popular goat-escape repo that was failing when imported.
 */
export function htmlEscape(strings: any, ...values: any) {
    const _htmlEscape = (toReplace: string) =>
        toReplace
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    if (typeof strings === 'string') {
        return _htmlEscape(strings);
    }

    let output = strings[0];
    for (const [index, value] of values.entries()) {
        output = output + _htmlEscape(String(value)) + strings[index + 1];
    }

    return output;
}
