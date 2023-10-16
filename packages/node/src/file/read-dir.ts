import { Dirent, ObjectEncodingOptions, PathLike } from 'fs';
import { readdir as fsreaddir } from 'fs/promises';
import { Observable } from 'rxjs';

import { isBufferEncoding, objHasBufferLiteral } from './type/buffer-encoding';

const fileTypes = (val: any) =>
    typeof val === 'object' &&
    'withFileTypes' in val &&
    val.withFileTypes === true;

export declare type readdirOptions1 =
    | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
      })
    | BufferEncoding
    | null;

export const isReaddirOptions1 = (val: any): val is readdirOptions1 => {
    return isBufferEncoding(val) || val === 'null' || fileTypes(val);
};

export declare type readdirOptions2 =
    | {
          encoding: 'buffer';
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
      }
    | 'buffer';

export const isReaddirOptions2 = (val: any): val is readdirOptions2 => {
    return (
        isBufferEncoding(val) ||
        val === 'null' ||
        (!fileTypes(val) && objHasBufferLiteral(val))
    );
};

export declare type readdirOptions3 =
    | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
      })
    | BufferEncoding
    | null;

export const isReadDirOptions3 = (val: any): val is readdirOptions3 => {
    return isBufferEncoding(val) || val === 'null' || !fileTypes(val);
};

export declare type readdirOptions4 = ObjectEncodingOptions & {
    withFileTypes: true;
    recursive?: boolean | undefined;
};

export const isReaddirOptions4 = (val: any): val is readdirOptions4 => {
    return fileTypes(val);
};

/**
 * Reads the contents of a directory.
 *
 * The optional `options` argument can be...
 *
 * - a string specifying an encoding
 * - an object with an `encoding` property specifying the character encoding to use for
 * the filenames.
 *
 * @usageNotes
 *
 * If `encoding` is set to `'buffer'`, the filenames returned
 * will be passed as `Buffer` objects.
 *
 * If `options.withFileTypes` is set to `true`, the resolved array will contain `fs.Dirent` objects.
 *
 * ```js
 * import { readdir } from 'node:fs/Observables';
 *
 * try {
 *   const files = await readdir(path);
 *   for (const file of files)
 *     console.log(file);
 * } catch (err) {
 *   console.error(err);
 * }
 * ```
 * @since v10.0.0
 * @return Fulfills with an array of the names of the files in the directory excluding `'.'` and `'..'`.
 */
export function readdir(
    path: PathLike,
    options?: readdirOptions1
): Observable<string[]>;

/**
 * Asynchronous readdir(3) - read a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function readdir(
    path: PathLike,
    options: readdirOptions2
): Observable<Buffer[]>;

/**
 * Asynchronous readdir(3) - read a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function readdir(
    path: PathLike,
    options?: readdirOptions3
): Observable<string[] | Buffer[]>;

/**
 * Asynchronous readdir(3) - read a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options If called with `withFileTypes: true` the result data will be an array of Dirent.
 */
export function readdir(
    path: PathLike,
    options: readdirOptions4
): Observable<Dirent[]>;

export function readdir(
    path: PathLike,
    segOrEncOrOpts?:
        | readdirOptions1
        | readdirOptions2
        | readdirOptions3
        | readdirOptions4
        | undefined
): Observable<string[] | Buffer[] | Dirent[]> {
    const selectFnCall = () => {
        if (segOrEncOrOpts === undefined) return fsreaddir(path);
        if (isReaddirOptions1(segOrEncOrOpts))
            return fsreaddir(path, segOrEncOrOpts);
        if (isReaddirOptions2(segOrEncOrOpts))
            return fsreaddir(path, segOrEncOrOpts);
        if (isReadDirOptions3(segOrEncOrOpts))
            return fsreaddir(path, segOrEncOrOpts);
        if (isReaddirOptions4(segOrEncOrOpts))
            return fsreaddir(path, segOrEncOrOpts);

        console.warn(
            'Warning: Failed to determine `readdir` implementation from arguments; ignoring `options`.'
        );

        return fsreaddir(path);
    };

    return new Observable<any>((subscriber) => {
        selectFnCall()
            .then((value) => {
                subscriber.next(value);
                subscriber.complete();
            })
            .catch((reason) => subscriber.error(reason));
    });
}
