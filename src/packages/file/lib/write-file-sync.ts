import { dirname } from 'path';
import { writeFileSync as fsWriteFileSync } from 'fs';

import { existsSync } from './exists-sync';
import { mkdirSync } from './mkdir-sync';
import { resolve } from './resolve';
import { rmSync } from './rm-synk';

/**
 * Writes a file to disk. If it isn't a string, it calls JSON.stringify on the object.
 * If the file's path doesn't exist, this creates it.
 * @param content The content to write to file.
 * @param pathSegments string paths to join. Non-string arguments are ignored.
 */
export function writeFileSync<T = void>(
    content: T,
    ...pathSegments: any[]
): void {
    try {
        const filePath = resolve(...pathSegments);
        const fileRootPath = dirname(filePath);

        if (!existsSync(fileRootPath)) {
            mkdirSync(fileRootPath);
        }

        if (existsSync(filePath)) {
            rmSync(filePath);
        }

        if (typeof content === 'string') {
            fsWriteFileSync(resolve(...pathSegments), content, 'utf-8');
        } else {
            fsWriteFileSync(
                resolve(...pathSegments),
                JSON.stringify(content),
                'utf-8'
            );
        }
    } catch (err) {
        console.warn(err);
    }
}
