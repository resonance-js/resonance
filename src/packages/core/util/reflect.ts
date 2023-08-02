import 'reflect-metadata';
import { isNotNull } from '../type/not-null';

/**
 * Extracts metadata from an object by key.
 * @param key The metadata key.
 * @param target The target object.
 * @returns The metadata associated with the object's key.
 */
export const getMetadata = (key: string, target: object) =>
    Reflect.getMetadata(key, target);

/**
 * Applies metadata to an object if the provided key, value, and target are non nulls.
 * @param key The metadata key.
 * @param value The metadata value.
 * @param target The metadata target.
 */
export const setMetadata = (key?: string, value?: any, target?: object) => {
    if (key && isNotNull(value) && target)
        Reflect.defineMetadata(key, value, target);
};

/**
 * Extracts all metadata from an object.
 * @param target The target object.
 * @returns All metadata associated with the object.
 */
export const getAllMetadata = (target: object) => {
    const metadata: Record<string, any> = {};
    Reflect.getMetadataKeys(target).forEach(
        (key) => (metadata[key] = getMetadata(key, target))
    );
    return metadata;
};

export const getClassMembers = (target: any) => {
    const toReturn: { [name: string | symbol]: any } = {};

    if (target.prototype) {
        Reflect.ownKeys(target.prototype).forEach((classMember) => {
            toReturn[classMember] = typeof target.prototype[classMember];
        });
    }

    return toReturn;
};
