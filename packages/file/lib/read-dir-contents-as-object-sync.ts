import { join } from 'path';

import { readDirSync } from './read-dir-sync';
import { readFileSync } from './read-file-sync';
import { resolve } from './resolve';

/**
 * Reads the contents of a directory, parses the files, and returns them
 * as on object, where the object's keys are filenames.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An array of parsed objects.
 */
export function readDirContentsSyncAsObject<T = any>(
    ...pathSegments: string[]
): Record<string, T> {
    const toReturn: { [key: string]: T } = {};

    const dirPath = resolve(...pathSegments);
    readDirSync(dirPath).forEach((f) => {
        const readFile = readFileSync<T>(dirPath, f);

        if (readFile) {
            toReturn[f] = readFile;
        } else {
            console.error(`Could not read file at ${join(dirPath, f)}`);
        }
    });

    return toReturn;
}
