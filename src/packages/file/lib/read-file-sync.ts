import { readFileSync as fsReadFileSync } from 'fs';

import { parse } from './parse';
import { existsSync } from './exists-sync';
import { resolve } from './resolve';

/**
 * Reads a file synchronously at the given
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns A parsed/unaltered object, or undefined if the file doesn't exit.
 */
export function readFileSync<T = any>(...pathSegments: any[]): T | undefined {
    const filePath = resolve(...pathSegments);

    if (existsSync(filePath)) {
        try {
            const rawFile = fsReadFileSync(filePath, 'utf-8');

            if (
                filePath.endsWith('json') ||
                rawFile.trimStart().startsWith('{') ||
                rawFile.trimStart().startsWith('[')
            ) {
                return JSON.parse(rawFile);
            } else if (filePath.endsWith('yml')) {
                return parse(rawFile);
            } else {
                return rawFile as unknown as T;
            }
        } catch (error: unknown) {
            console.warn(`Failed to read file at ${filePath}.`);
        }
    }

    return undefined;
}
