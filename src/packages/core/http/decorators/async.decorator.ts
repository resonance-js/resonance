export const AsyncMetadataKey = 'resonance:async';
export const PeerMetadataKey = 'resonance:peer';

/**
 * Decorator that marks a function as an async endpoint.
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
export function Async() {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        Reflect.defineMetadata(AsyncMetadataKey, key, descriptor.value);
        return descriptor;
    };
}

export function Peer() {
    return function (target: Object, propertyKey: string | symbol) {
        console.log(target, propertyKey);
        // Reflect.defineMetadata(AsyncMetadataKey, key, descriptor.value);
        // return descriptor;
    };
}

/**
 * Evaluates whether the `get` metadata has been defined for a function.
 * @param fnction The function of a {@link Route}.
 */
export const isAsync = (fnction: Function) =>
    Reflect.hasMetadata(AsyncMetadataKey, fnction);
