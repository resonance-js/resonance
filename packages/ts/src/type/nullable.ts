export declare type Nullable = null | undefined;

export const isNonNullable = <T>(
    value: T | Nullable
): value is NonNullable<T> => {
    return value !== null && value !== undefined;
};

export function isNullable(value: unknown): value is Nullable {
    return value === null || value === undefined;
}
