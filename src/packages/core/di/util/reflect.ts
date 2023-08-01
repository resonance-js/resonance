import { Class } from '../../interface/class';

// /**
//  * Parses the class name from its constructor's `toString()` method.
//  * @param constructorString `klass.prototype.constructor`
//  */
// const parseClassParameters = (constructorString: any) => {
//     return (constructorString as string)
//         .substring(
//             constructorString.indexOf('constructor') + 12,
//             constructorString.indexOf(')')
//         )
//         .trim()
//         .split(',')
//         .filter((parameter) => parameter.length > 0);
// };

/**
 * Extracts injected dependencies from a class.
 * @param klass A class with 0 or more injected dependencies.
 * @returns An array of klass' injected dependencies, or an empty array.
 */
export const getInjectedDeps = (klass: Class): string[] =>
    (
        Reflect.getOwnMetadata(
            'design:paramtypes',
            klass.prototype.constructor
        ) ?? []
    )
        .map((item: any) => getClassName(item))
        .filter((args: string) => args.length > 0);

/**
 * Returns the type of a class.
 * @param klass A class.
 * @returns The name of the class.
 */
export const getClassName = (klass: Class | Function): string => {
    const match = (klass.prototype.constructor.toString() as string).match(
        /class\s(.[^\s]{1,})/
    );

    if (match) return match[0].replace('class ', '');
    else throw Error('Failed to locate class with name');
};
