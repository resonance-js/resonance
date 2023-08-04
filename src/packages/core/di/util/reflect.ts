import { Class } from '../../interface/class';

/**
 * Extracts injected dependencies from a class.
 * @param reference A class with 0 or more injected dependencies.
 * @returns An array of reference's injected dependencies, or an empty array.
 */
export const getInjectedDeps = (reference: Class): string[] =>
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
export const getClassName = (reference: Class | Function): string => {
    const match = (reference.prototype.constructor.toString() as string).match(
        /class\s(.[^\s]{1,})/
    );

    if (match) return match[0].replace('class ', '');
    else throw Error('Failed to locate class with name');
};
