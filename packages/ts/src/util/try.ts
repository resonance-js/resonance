export function tryCatch<T>(trier: () => T): T;

export function tryCatch(trier: () => void): void;

export function tryCatch<T, E>(
    trier: () => T,
    error: (error: unknown) => E
): T | E;

export function tryCatch<T>(
    trier: () => T,
    error: (error: unknown) => void
): T | void;

export function tryCatch<E>(trier: () => void, error: (error: unknown) => E): E;

export function tryCatch<T, E>(
    trier: () => T | void,
    error?: (error: unknown) => E | void
): T | E | void {
    try {
        return trier();
    } catch (err) {
        if (error) return error(err);
    }
}
