import { readFileSync as fsReadFileSync, PathOrFileDescriptor } from 'fs';
import { isBufferEncoding } from './type/buffer-encoding';
import { parse as parseYaml } from 'yaml';
import { YamlParseOptions } from './type/is-yaml-parse-options';
import { isYaml } from './type/yaml';
import { isJSON } from './type/json';
import { join } from 'path';

/**
 * Synchronously reads the entire contents of a file and returns a Buffer of the file contents.
 *
 * @param path A path to a file.
 *
 * @throws Will throw any parse or read errors.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(path: PathOrFileDescriptor | string[]): Buffer;

/**
 * Synchronously reads the entire contents of a file and returns a Buffer of the file contents.
 *
 * @param path A path to a file.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @throws Will throw any parse or read errors.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(
    path: PathOrFileDescriptor | string[],
    options?: {
        throwError?: true;
        flag?: Exclude<string, BufferEncoding>;
    }
): Buffer;

/**
 * Synchronously reads the entire contents of a file and returns a Buffer of the file contents.
 *
 * @param path A path to a file.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(
    path: PathOrFileDescriptor | string[],
    options: {
        throwError: false;
        flag?: Exclude<string, BufferEncoding>;
    }
): Buffer;

/**
 * Synchronously reads the entire contents of a file.
 *
 * @param path A path to a file.
 * @param encoding Specifies the encoding of the string that results from the buffer to string operation.
 *
 * @throws Will throw any parse or read errors.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(
    path: PathOrFileDescriptor | string[],
    encoding: BufferEncoding
): string;

/**
 * Synchronously reads the entire contents of a file.
 *
 * @param path A path to a file.
 * @param options.encoding Specifies the encoding of the string that results from the buffer to string operation.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @throws Will throw any parse or read errors.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(
    path: PathOrFileDescriptor | string[],
    options: {
        encoding: BufferEncoding;
        throwError?: true;
        flag?: Exclude<string, BufferEncoding>;
    }
): string;

/**
 * Synchronously reads the entire contents of a file.
 *
 * @param path A path to a file.
 * @param options.encoding Specifies the encoding of the string that results from the buffer to string operation.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync(
    path: PathOrFileDescriptor | string[],
    options: {
        encoding: BufferEncoding;
        throwError: false;
        flag?: Exclude<string, BufferEncoding>;
    }
): string;

/**
 * Synchronously reads the entire contents of a file and parses it.
 *
 * @param path A path to a file.
 * @param options.parse Specifies whether the read-in file should be parsed.
 * @param options.parseOptions Defines parse settings for YAML files. If the read-in file is not a YAML file,
 * `readFileSync` disregards `parseOptions`.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @throws Will throw any parse or read errors.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync<T>(
    path: PathOrFileDescriptor | string[],
    options: {
        parse: true;
        parseOptions?: YamlParseOptions;
        throwError?: true;
        flag?: Exclude<string, BufferEncoding>;
    }
): T;

/**
 * Synchronously reads the entire contents of a file and parses it.
 *
 * @param path A path to a file.
 * @param options.parse Specifies whether the read-in file should be parsed.
 * @param options.parseOptions Defines parse settings for YAML files. If the read-in file is not a YAML file,
 * `readFileSync` disregards `parseOptions`.
 * @param options.throwError Specifies whether read/parse errors should be logged or thrown.
 * @param options.flag An optional flag that defaults to `'r'`.
 *
 * @usageNotes
 *
 * For `path`...
 * - If a string or string[] is passed, the path will not be resolved with `resolve()`.
 * - If a URL is passed, it must use the `file:` protocol.
 * - If a File Descriptor is passed, the underlying file will _not_ be closed automatically.
 */
export function readFileSync<T>(
    path: PathOrFileDescriptor | string[],
    options: {
        parse: true;
        parseOptions?: YamlParseOptions;
        throwError: false;
        flag?: Exclude<string, BufferEncoding>;
    }
): T;

export function readFileSync<T>(
    pathOrPathSegments: PathOrFileDescriptor | string[],
    options?:
        | {
              encoding?: BufferEncoding | 'buffer';
              flag?: Exclude<string, BufferEncoding>;
              throwError?: boolean;
              parse?: boolean;
              parseOptions?: YamlParseOptions;
          }
        | BufferEncoding
): string | Buffer | T {
    let path = Array.isArray(pathOrPathSegments)
        ? join(...pathOrPathSegments)
        : pathOrPathSegments;
    let parseOpts: YamlParseOptions | undefined;
    let parse = false;
    let flag = 'r';
    let encoding: BufferEncoding | null;
    let throwError = true;

    if (isBufferEncoding(options)) {
        encoding = options;
    } else {
        parseOpts = options?.parseOptions ?? undefined;
        parse = options?.parse ?? false;
        flag = options?.flag ?? 'r';
        throwError = options?.throwError ?? true;
    }

    const selectFnCall = () =>
        parse
            ? fsReadFileSync(path, {
                  encoding: encoding ?? 'utf-8',
                  flag
              })
            : fsReadFileSync(path, {
                  flag
              });

    const readFile = () => {
        const file = selectFnCall();

        if (parse && isJSON(file)) {
            return JSON.parse(file);
        } else if (parse && isYaml(file)) {
            return parseYaml(file, parseOpts);
        } else {
            return file;
        }
    };

    const handleError = (error: unknown) => {
        if (throwError) {
            throw error;
        } else {
            if (parse) {
                return {} as T;
            } else if (encoding) {
                return '';
            } else {
                return Buffer.from('{}');
            }
        }
    };

    try {
        return readFile();
    } catch (reason) {
        return handleError(reason);
    }
}
