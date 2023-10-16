import { readDirSync } from './read-dir-sync';
import { readFileSync } from './read-file-sync';
import { resolve } from './resolve';

export interface ReadDirContentsOptions {
    asObject: boolean;
}

export function readDirContentsSync<T = any>(...pathSegments: string[]): T[];
export function readDirContentsSync<T = any>(
    options: {
        asObject: false;
    },
    ...pathSegments: string[]
): T[];
export function readDirContentsSync<T = any>(
    options: {
        asObject: true;
    },
    ...pathSegments: string[]
): Record<string, T | undefined>;

/**
 * Reads the contents of a directory, parses the files, and returns them
 * in an array. If the directory doesn't exist, this creates it.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An array of parsed objects.
 */
export function readDirContentsSync<T>(
    ...pathSegments: (string | ReadDirContentsOptions)[]
): (T | undefined)[] | Record<string, T | undefined> {
    const pathOrOpts = pathSegments.shift();

    let opts: ReadDirContentsOptions | undefined;
    let path: string[];

    if (typeof pathOrOpts === 'string') {
        path = [pathOrOpts, ...(pathSegments as string[])];
    } else {
        opts = pathOrOpts;
        path = pathSegments as string[];
    }

    const toReturn: Record<string, T | undefined> = {};
    const dirPath = resolve(...path);
    readDirSync(dirPath).forEach((f) => {
        toReturn[f] = readFileSync<T>(dirPath, f);

        if (!toReturn[f]) {
            console.error(`Could not read file at ${resolve(dirPath, f)}`);
        }
    });

    return opts?.asObject ? toReturn : Object.values(toReturn);
}
