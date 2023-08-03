export const DeleteMetadataKey = 'resonance:delete';

/**
 * Decorator that marks a function as a `delete` endpoint.'
 * @param path Defines the endpoint that will invoke the decorated function.
 *
 * @usageNotes
 *
 * Decorating a function with `@Delete()` ensures that the compiler
 * will generate the metadata necessary to create a DELETE route.
 *
 * Unless the decorated function returns a static object or variable,
 * we recommend returning an Observable. When the HTTP method is called,
 * Resonance handles subscribing, unsubscribing, and destorying the
 * observable.
 */
export function Delete(...path: string[]) {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        Reflect.defineMetadata(
            DeleteMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}

/**
 * Evaluates whether the `delete` metadata has been defined for a function.
 * @param fnction The function of a {@link Route}.
 */
export const isDelete = (fnction: Function) =>
    Reflect.hasMetadata(DeleteMetadataKey, fnction);
