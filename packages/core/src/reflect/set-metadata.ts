/**
 * Applies metadata to an object if the provided key, value, and target are non nulls.
 * @param key The metadata key.
 * @param value The metadata value.
 * @param target The metadata target.
 */
export const setMetadata = (key?: string, value?: any, target?: object) => {
    if (key && isNonNullable(value) && target)
        Reflect.defineMetadata(key, value, target);
};
