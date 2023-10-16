import { Observable } from 'rxjs';
import {
    YamlParseOptions,
    isYamlParseOptions
} from './type/is-yaml-parse-options';
import { isBufferEncoding } from './type';
import { isJSON } from './type/json';
import { parse as parseYaml } from 'yaml';

/**
 * Parses a decoded string to `T`.
 * @param val The string to parse, either a raw JSON or YAML string.
 * @param opts YAML parsing options if `val` is a raw YAML file.
 */
export function parse<T>(val: string, opts?: YamlParseOptions): Observable<T>;

/**
 * Decodes a buffer to a string and parses it to `T`.
 * @param val The buffer to parse, either a buffer of a raw JSON or YAML string.
 * @param encoding The encoding that will be used to parse `val`.
 * @param opts YAML parsing options if `val` is a buffer of a raw YAML file.
 */
export function parse<T>(
    val: Buffer,
    encoding?: BufferEncoding,
    opts?: YamlParseOptions
): Observable<T>;

export function parse<T>(
    val: Buffer | string,
    encodingOrOpts?: YamlParseOptions | BufferEncoding,
    optsOrNull?: YamlParseOptions
): Observable<T> {
    return new Observable<T>((subscriber) => {
        if (Buffer.isBuffer(val)) {
            val = val.toString(
                isBufferEncoding(encodingOrOpts) ? encodingOrOpts : 'utf-8'
            );
        }

        try {
            if (isJSON(val)) {
                subscriber.next(JSON.parse(val));
            } else {
                subscriber.next(
                    parseYaml(
                        val,
                        isYamlParseOptions(encodingOrOpts)
                            ? encodingOrOpts
                            : isYamlParseOptions(optsOrNull)
                            ? optsOrNull
                            : undefined
                    )
                );
            }
            subscriber.complete();
        } catch (error) {
            subscriber.error(error);
        }
    });
}
