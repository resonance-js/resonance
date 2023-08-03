export function toBoolean(val: unknown, defaultVal?: boolean): boolean {
    switch (typeof val) {
        case 'boolean':
            return val;
        case 'string':
            return val === 'true';
        case 'number':
            return val > 0;
        default:
            return defaultVal ?? false;
    }
}

export function toString(
    val: unknown,
    defaultVal?: string
): string | undefined {
    if (val === undefined) return defaultVal;

    switch (typeof val) {
        case 'string':
            return val;
        default:
            return val + '';
    }
}

export function toNumber(
    val: unknown,
    defaultVal?: number
): number | undefined {
    if (val === undefined) return defaultVal;

    switch (typeof val) {
        case 'number':
            return val;
        case 'string':
            const number = Number.parseInt(val);
            return !Number.isNaN(number) ? number : defaultVal ?? undefined;
        default:
            return defaultVal;
    }
}
