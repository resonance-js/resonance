import { Observable, of } from 'rxjs';
import { readDirSync } from './read-dir-sync';

export interface readDirOptions {
    bufferAll: boolean;
}

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param opts Options for reading the directory.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An observable that emits each file in the directory.
 */
export function readDir(
    opts: readDirOptions,
    ...pathSegments: string[]
): Observable<string[]>;

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param opts Options for reading the directory.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An observable that emits each file in the directory.
 */
export function readDir(
    opts: {
        bufferAll: true;
    },
    ...pathSegments: string[]
): Observable<string[]>;

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param opts Options for reading the directory.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An observable that emits each file in the directory.
 */
export function readDir(
    opts: {
        bufferAll: false;
    },
    ...pathSegments: string[]
): Observable<string>;

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An observable that emits each file in the directory.
 */
export function readDir(...pathSegments: string[]): Observable<string>;

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An observable that emits each file in the directory.
 */
export function readDir(
    bufferAll: readDirOptions | string,
    ...pathSegments: string[]
): Observable<string | string[]> {
    if (typeof bufferAll !== 'string') {
        return bufferAll
            ? of(readDirSync(...pathSegments))
            : of(...readDirSync(...pathSegments));
    } else {
        return of(...readDirSync(bufferAll, ...pathSegments));
    }
}
