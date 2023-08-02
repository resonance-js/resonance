import { lstatSync } from './lstat-sync';

export function isDirectory(...pathSegments: string[]): boolean {
    return lstatSync(...pathSegments)?.isDirectory() || false;
}
