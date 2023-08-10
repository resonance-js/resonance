import { rmdirSync as fsRmDirSync } from 'fs';

import { existsSync } from './exists-sync';
import { resolve } from './resolve';

export function rmDirSync(...pathSegments: string[]): boolean {
    try {
        if (existsSync(resolve(...pathSegments))) {
            fsRmDirSync(resolve(...pathSegments), { recursive: true });
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
