import 'reflect-metadata';
import { isNonNullable } from '../../../cxjs/lib/conditionals/is-non-nullable';
import { Class } from '../interface/class';

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
    if (key && isNonNullable(value) && target)
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

export const getClassMembers = (target: Class<any>) => {
    const toReturn: { [name: string | symbol]: any } = {};

    if (target.prototype) {
        Reflect.ownKeys(target.prototype).forEach((classMember) => {
            toReturn[classMember] = typeof target.prototype[classMember];
        });
    }

    return toReturn;
};

export const getConstructorParameters = (target: any) => {
    const toReturn: { [name: string | symbol]: any } = {};

    if (target) {
        Reflect.ownKeys(target).forEach((parameters) => {
            toReturn[parameters] = typeof target[parameters];
        });
    }

    return toReturn;
};

export const getFunctionParameters = (target: any, key: string | symbol) =>
    (Reflect.getMetadata('design:paramtypes', target, key) ?? []).map(
        (val: any) => {
            return (val.toString() as string)
                .split(' ')[1]
                .replace('()', '')
                .toLowerCase();
        }
    );

/**
 * Extracts injected dependencies from a class.
 * @param reference A class with 0 or more injected dependencies.
 * @returns An array of reference's injected dependencies, or an empty array.
 */
export const getInjectedDeps = (reference: Class<any>): string[] =>
    (
        Reflect.getOwnMetadata(
            'design:paramtypes',
            reference.prototype.constructor
        ) ?? []
    )
        .map((item: any) => getClassName(item))
        .filter((args: string) => args.length > 0);

/**
 * Returns the type of a class.
 * @param reference A class.
 * @returns The name of the class.
 */
export const getClassName = (reference: Class<any>): string => {
    const match = (reference.prototype.constructor.toString() as string).match(
        /class\s(.[^\s]{1,})/
    );

    if (match) return match[0].replace('class ', '');
    else throw Error('Failed to locate class with name');
};
