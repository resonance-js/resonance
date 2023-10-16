import { squish } from './join';

export function formatCamelCase(text: string) {
    const sentenceCase = text.replace(/([A-Z])/g, '$1').trim();
    return sentenceCase.charAt(0).toLowerCase() + sentenceCase.slice(1);
}

/**
 * Formats a dash-delimited string as camel case.
 * @param text The string to manipulate.
 * @returns A string with dashes removed and text following dashes converted to upper-case.
 */
export function dashToCamelCase(text: string) {
    const cc = squish(
        ...text
            .split('-')
            .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
    );

    return cc.charAt(0).toLowerCase() + cc.slice(1);
}
