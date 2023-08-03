import { size } from './size';

/**
 * Returns the size of a given file in MB.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 * @returns The size of a file in mb.
 */
export function fileSizeInMb(...pathSegments: string[]): number {
    return size(...pathSegments) / (1024 * 1024);
}
