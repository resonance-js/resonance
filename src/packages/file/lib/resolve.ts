import { resolve as fsResolve } from 'path';

export function resolve(...pathSegments: any[]) {
    return fsResolve(...pathSegments.map((segment) => String(segment)));
}
