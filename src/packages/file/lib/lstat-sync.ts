import { Stats, statSync } from 'fs';
import { resolve } from './resolve';

export function lstatSync(...pathSegments: string[]): Stats | undefined {
    try {
        return statSync(resolve(...pathSegments));
    } catch (err) {
        console.error(err);
    }

    return undefined;
}
