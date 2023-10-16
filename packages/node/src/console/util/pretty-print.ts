import {
    openBrace,
    comma,
    newLn,
    closeBrace,
    openBracket,
    closeBracket
} from './var';
import { colorizeVal, formatIndent, formatObjKey } from './colorize';

/**
 * Formats and colorizes tree-like data structures for printing to the console.
 * The output string cannot be converted back into an object due to inbedded color codes.
 * @param val The value to format.
 * @returns A formatted string representation of the object for logging to the console.
 */
export function prettyPrint(val: any): string;

/**
 * Formats and colorizes tree-like data structures for printing to the console.
 * @param val The value to format.
 * @param depth (optional) The depth of `val` in the tree.
 * @param key (optional) The key associated with `val`.
 * @returns A formatted string representation of the object for logging to the console.
 */
export function prettyPrint(val: any, depth?: number, key?: string): string;

export function prettyPrint(val: any, depth = 0, key?: string) {
    const rows: any[] = [];

    if (Array.isArray(val)) {
        rows.push(
            [
                formatObjKey(key, depth) + openBracket,
                val
                    .flatMap((arrayVal) => prettyPrint(arrayVal, depth + 1))
                    .join(comma + newLn),
                formatIndent(depth) + closeBracket
            ].join(newLn)
        );
    } else if (typeof val === 'object') {
        rows.push(
            [
                formatObjKey(key, depth) + openBrace,
                Object.keys(val)
                    .flatMap((key) => prettyPrint(val[key], depth + 1, key))
                    .join(comma + newLn),
                formatIndent(depth) + closeBrace
            ].join(newLn)
        );
    } else {
        rows.push(formatObjKey(key, depth) + colorizeVal(val as any));
    }

    return rows.join(newLn);
}
