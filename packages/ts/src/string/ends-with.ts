export function endsWith(val: string, token: RegExp): boolean;

export function endsWith(
    val: string,
    token: string[] | string,
    options?: {
        caseSensitive: boolean;
    }
): boolean;

export function endsWith(
    val: string,
    token: RegExp | string[] | string,
    options?: {
        caseSensitive: boolean;
    }
) {
    if (options?.caseSensitive === false) {
        val = val.toLowerCase();

        if (typeof token === 'string') {
            token = token.toLowerCase();
        }

        if (Array.isArray(token)) {
            token = token.map((token) => token.toLowerCase());
        }
    }

    if (typeof token === 'string') return val.endsWith(token);
    if (Array.isArray(token)) return token.some((token) => val.endsWith(token));

    const match = val.match(token);
    if (match && match.length > 0)
        return match.some(
            (match) => val.indexOf(match) === val.length - match.length
        );

    return false;
}
