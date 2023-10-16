import { readFileSync as fsReadFileSync, PathOrFileDescriptor } from 'fs';
import { isBufferEncoding } from './type/buffer-encoding';
import { Observable } from 'rxjs';
import { parse as parseYaml } from 'yaml';
import {
    isYamlParseOptions,
    YamlParseOptions
} from './type/is-yaml-parse-options';
import { isYaml } from './type/yaml';
import { isJSON } from './type/json';

/**
 * Reads the entire contents of a file.
 *
 * @param path A path to a file.
 * @param options Determines
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 *
 */
export function readFile(
    path: PathOrFileDescriptor,
    flag?: string
): Observable<Buffer>;

export function readFile(
    path: PathOrFileDescriptor,
    encoding?: 'buffer',
    flag?: string
): Observable<Buffer>;

export function readFile(
    path: PathOrFileDescriptor,
    encoding?: BufferEncoding,
    flag?: string
): Observable<string>;

export function readFile<T>(
    path: PathOrFileDescriptor,
    parse?: true | YamlParseOptions,
    flag?: string
): Observable<T>;

export function readFile(
    path: PathOrFileDescriptor,
    encodingOrParseOrFlag?:
        | string
        | 'buffer'
        | BufferEncoding
        | boolean
        | YamlParseOptions,
    flag: string = 'r'
): Observable<string | Buffer> {
    let parseOpts: YamlParseOptions;
    let parse: boolean;

    const selectFnCall = () => {
        let encoding: BufferEncoding | undefined;

        if (isBufferEncoding(encodingOrParseOrFlag)) {
            encoding = encodingOrParseOrFlag;
        } else if (isYamlParseOptions(encodingOrParseOrFlag)) {
            parse = true;
            parseOpts = encodingOrParseOrFlag;
            encoding = 'utf-8';
        } else if (typeof encodingOrParseOrFlag === 'boolean') {
            parse = true;
            encoding = 'utf-8';
        } else if (typeof encodingOrParseOrFlag === 'string') {
            flag = encodingOrParseOrFlag;
        }

        if (encoding) {
            return fsReadFileSync(path, {
                encoding,
                flag
            });
        } else {
            return fsReadFileSync(path, {
                flag
            });
        }
    };

    return new Observable<string | Buffer>((subscriber) => {
        try {
            const file = selectFnCall();

            if (parse && isJSON(file)) {
                subscriber.next(JSON.parse(file));
            } else if (parse && isYaml(file)) {
                subscriber.next(parseYaml(file, parseOpts));
            } else {
                subscriber.next(file);
            }

            subscriber.complete();
        } catch (reason) {
            subscriber.error(reason);
        }
    });
}
