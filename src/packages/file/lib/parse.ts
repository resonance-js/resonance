import { parse as parseYML } from 'yaml';

/**
 * Parses content.
 * @param content The content to parse.
 * @returns Returns the typed content or undefined if it cannot parse the content.
 */
export function parse<T = void>(content: string): T | undefined {
    try {
        return JSON.parse(content) as T;
    } catch (error) {
        try {
            return parseYML(content) as T;
        } catch (ymlError) {
            console.error(error);
            console.error(ymlError);
        }
    }

    return {} as T;
}
