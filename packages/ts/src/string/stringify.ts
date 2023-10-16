/**
 * Calls the JSON.stringify method and catches errors.
 * @param value The object to be transformed into a string.
 * @param options Optional parameters for the stringify method.
 * @returns A string representation of the object or an empty string.
 */
export function stringify(
    value: object,
    options?: {
        returnStringObjectOnError?: boolean;
        printError?: boolean;
    }
): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        if (options) {
            if (options.printError) {
                console.error(error);
            }
            if (options.returnStringObjectOnError) {
                return String(value);
            } else {
                return '';
            }
        }
        return '';
    }
}