import { prettyPrint } from './util';
import { cyan, green, magenta, red, yellow } from './util/colorize';

export namespace console {
    export function logStructuredDate(value: any) {
        globalThis.console.log(prettyPrint(value));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/log) */
    export function log(message?: any, ...optionalParams: any[]) {
        globalThis.console.log(...green(message, ...optionalParams));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/info) */
    export function info(message?: any, ...optionalParams: any[]) {
        globalThis.console.info(...cyan(message, ...optionalParams));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/debug) */
    export function debug(message?: any, ...optionalParams: any[]) {
        globalThis.console.debug(...yellow(message, ...optionalParams));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/warn) */
    export function warn(message?: any, ...optionalParams: any[]) {
        globalThis.console.warn(...magenta(message, ...optionalParams));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/error) */
    export function error(message?: any, ...optionalParams: any[]) {
        globalThis.console.error(...red(message, ...optionalParams));
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/assert) */
    export const assert = globalThis.console.assert;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/clear) */
    export const clear = globalThis.console.clear;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/count) */
    export const count = globalThis.console.count;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/countReset) */
    export const countReset = globalThis.console.countReset;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/dir) */
    export const dir = globalThis.console.dir;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/dirxml) */
    export const dirxml = globalThis.console.dirxml;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/group) */
    export const group = globalThis.console.group;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/groupCollapsed) */
    export const groupCollapsed = globalThis.console.groupCollapsed;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/groupEnd) */
    export const groupEnd = globalThis.console.groupEnd;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/table) */
    export const table = globalThis.console.table;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/time) */
    export const time = globalThis.console.time;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeEnd) */
    export const timeEnd = globalThis.console.timeEnd;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeLog) */
    export const timeLog = globalThis.console.timeLog;
    export const timeStamp = globalThis.console.timeStamp;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/trace) */
    export const trace = globalThis.console.trace;
}
