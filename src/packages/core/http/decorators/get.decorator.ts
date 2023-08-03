export const GetMetadataKey = 'resonance:get';

/**
 * Decorator that marks a function as a `get` endpoint.'
 * @param path Defines the endpoint that will invoke the decorated function.
 *
 * @usageNotes
 *
 * Decorating a function with `@Get()` ensures that the compiler
 * will generate the metadata necessary to create a GET route.
 *
 * Unless the decorated function returns a static object or variable,
 * we recommend returning an Observable. When the HTTP method is called,
 * Resonance handles subscribing, unsubscribing, and destorying the
 * observable.
 */
export function Get(...path: string[]) {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        Reflect.defineMetadata(
            GetMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}

/**
 * Evaluates whether the `get` metadata has been defined for a function.
 * @param fnction The function of a {@link Route}.
 */
export const isGet = (fnction: Function) =>
    Reflect.hasMetadata(GetMetadataKey, fnction);
