/**
 * Ripped from the popular goat-escape repo that was failing when imported.
 */
export function htmlEscape(strings: any, ...values: any) {
    const _htmlEscape = (toReplace: string) =>
        toReplace
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    if (typeof strings === 'string') {
        return _htmlEscape(strings);
    }

    let output = strings[0];
    for (const [index, value] of values.entries()) {
        output = output + _htmlEscape(String(value)) + strings[index + 1];
    }

    return output;
}