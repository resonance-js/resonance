import { lstatSync } from './lstat-sync';
import { resolve } from './resolve';

export function createdTime(...pathSegments: string[]): Date | undefined {
    return lstatSync(resolve(...pathSegments))?.ctime || undefined;
}
