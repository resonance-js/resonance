import { mkdirSync as fsmkDirSync } from 'fs';

import { existsSync } from './exists-sync';
import { resolve } from './resolve';

/**
 * Creates a directory with a mode of `0o777`.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns
 */
export function mkdirSync(...pathSegments: string[]): boolean {
    try {
        if (!existsSync(...pathSegments))
            fsmkDirSync(resolve(...pathSegments), {
                recursive: true
            });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
