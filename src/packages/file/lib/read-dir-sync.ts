import { readdirSync as fsReaddirSync } from 'fs';

import { existsSync } from './exists-sync';
import { mkdirSync } from './mkdir-sync';
import { resolve } from './resolve';

/**
 * Reads a directory, creating if recursively if it does not exist.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns An array containing all the files in the dir or an empty array.
 */
export function readDirSync(...pathSegments: string[]): string[] {
    const dirPath = resolve(...pathSegments);
    try {
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath);
        }

        return fsReaddirSync(dirPath);
    } catch (err: any) {
        console.warn(err['message'] || `Failed to read dir at ${dirPath}.`);
    }

    return [];
}
