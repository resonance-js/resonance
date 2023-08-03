import { unlinkSync as fsUnlinkSync } from 'fs';

import { resolve } from './resolve';

export function rmSync(...pathSegments: any[]): boolean {
    try {
        fsUnlinkSync(resolve(...pathSegments));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
