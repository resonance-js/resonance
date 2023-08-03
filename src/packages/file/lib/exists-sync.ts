import { resolve } from './resolve';
import { existsSync as fsExistsSync } from 'fs';

/**
 * Checks if a path exists.
 * @param pathSegments string paths to join. Non-string arguments are ignored.

 * @returns true if the path exists; else, false.
 */
export function existsSync(...pathSegments: any[]): boolean {
    return fsExistsSync(
        resolve(...pathSegments.map((segment) => String(segment)))
    );
}
