import { join } from 'path';
import { rmdirSync as fsRmDirSync, unlinkSync as fsUnlinkSync } from 'fs';

import { existsSync } from './exists-sync';
import { isDirectory } from './is-directory';
import { readDirSync } from './read-dir-sync';

/**
 * Removes a directory and all of its files.
 * @param p The path to the deleted directory.
 */
export function rmDirRecursiveSync(p: string) {
    let files: string[] = [];
    if (existsSync(p)) {
        files = readDirSync(p);
        files.forEach((file) => {
            const curPath = join(p, file);
            if (isDirectory(curPath)) {
                rmDirRecursiveSync(curPath);
            } else {
                try {
                    fsUnlinkSync(curPath);
                } catch (err) {
                    console.error(err);
                }
            }
        });
        try {
            fsRmDirSync(p);
        } catch (err) {
            console.error(err);
        }
    }
}
