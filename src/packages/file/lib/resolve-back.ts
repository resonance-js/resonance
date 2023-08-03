import { readdirSync } from 'fs';

/**
 * Steps back from the current directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param throwError If an error should be thrown.
 * @returns The path to the found directory.
 * @throws Will throw an error if the directory cannot be found.
 */
export function resolveBack(rootFileOrDir: string, throwError: true): string;

/**
 * Steps back from the current directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param throwError If an error should be thrown.
 * @returns The path to the found directory or undefined if the directory cannot be found.
 */
export function resolveBack(
    rootFileOrDir: string,
    throwError: false
): string | undefined;

/**
 * Steps back from the current or given directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param path The path from which findBackDir will start stepping backwards.
 * @param throwError If an error should be thrown.
 * @returns The path to the found directory.
 * @throws Will throw an error if the directory cannot be found.
 */
export function resolveBack(
    rootFileOrDir: string,
    path: string,
    throwError: true
): string;

/**
 * Steps back from the current or given directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param path The path from which findBackDir will start stepping backwards.
 * @param throwError If an error should be thrown.
 * @returns The path to the found directory or undefined if the directory cannot be found.
 */
export function resolveBack(
    rootFileOrDir: string,
    path: string,
    throwError: false
): string | undefined;

/**
 * Steps back from the current or given directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param path (optional) The path from which findBackDir will start stepping backwards.
 * @returns The path to the found directory or undefined if the directory cannot be found.
 */
export function resolveBack(
    rootFileOrDir: string,
    path?: string
): string | undefined;

/**
 * Steps back from the current or given directory until a file or directory is found.
 * @param rootFileOrDir The name of a file or directory that lives in the directory you are stepping back to.
 * @param path (optional) The path from which findBackDir will start stepping backwards.
 * @returns The path to the found directory.
 */
export function resolveBack(
    rootFileOrDir: string,
    pathOrThrowError?: string | boolean,
    throwError?: boolean
): string | undefined {
    let path: string | undefined;

    if (typeof pathOrThrowError === 'string') {
        path = pathOrThrowError;
    } else {
        path = path ?? __dirname;
        throwError = pathOrThrowError;
    }

    if (throwError === undefined) {
        throwError = false;
    }

    try {
        if (readdirSync(path).includes(rootFileOrDir)) {
            return path;
        } else {
            if (throwError) {
                return resolveBack(
                    rootFileOrDir,
                    path.substring(0, path.lastIndexOf('/')),
                    true
                );
            } else {
                return resolveBack(
                    rootFileOrDir,
                    path.substring(0, path.lastIndexOf('/')),
                    false
                );
            }
        }
    } catch (error) {
        if (throwError) {
            throw error;
        } else {
            console.error(error);
            return undefined;
        }
    }
}
