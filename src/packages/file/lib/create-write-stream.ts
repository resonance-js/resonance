import { WriteStream, createWriteStream as fsCreateWriteStream } from 'fs';
import { resolve } from './resolve';

/**
 * Returns a new WriteStream object.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns a new WriteStream object pointing at the given
 */
export function createWriteStream(...pathSegments: string[]): WriteStream {
    return fsCreateWriteStream(resolve(...pathSegments));
}
