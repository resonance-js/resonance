export const PostMetadataKey = 'resonance:post';

/**
 * Decorator that marks a function as a `post` endpoint.'
 * @param path Defines the endpoint that will invoke the decorated function.
 *
 * @usageNotes
 *
 * Decorating a function with `@Post()` ensures that the compiler
 * will generate the metadata necessary to create a POST route.
 *
 * Unless the decorated function returns a static object or variable,
 * we recommend returning an Observable. When the HTTP method is called,
 * Resonance handles subscribing, unsubscribing, and destorying the
 * observable.
 */
export function Post(...path: string[]) {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        Reflect.defineMetadata(
            PostMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}

/**
 * Evaluates whether the `post` metadata has been defined for a function.
 * @param fnction The function of a {@link Route}.
 */
export const isPost = (fnction: Function) =>
    Reflect.hasMetadata(PostMetadataKey, fnction);
