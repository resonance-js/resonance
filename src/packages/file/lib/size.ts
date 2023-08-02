import { lstatSync } from './lstat-sync';

export function size(...pathSegments: string[]): number {
    return lstatSync(...pathSegments)?.size || 0;
}
