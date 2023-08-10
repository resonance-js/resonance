import { AuthLifecycleFns } from './auth_lifecycle';

export const AuthMetadataKey = 'resonance:auth';

export type SupportedAuthProtocol = 'basic' | 'bearer';

/**
 * Decorator that marks a function as an endpoint that requires authentication.
 * @param path Defines the endpoint that will invoke the decorated function.
 *
 * @usageNotes
 *
 * Decorating a function with `@AuthGuard()` ensures that the compiler
 * will generate the metadata necessary to add authentication to a route.
 */
export function AuthGuard(protocol: keyof AuthLifecycleFns) {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        Reflect.defineMetadata(AuthMetadataKey, protocol, descriptor.value);
        return descriptor;
    };
}

/**
 * Evaluates whether the `get` metadata has been defined for a function.
 * @param fn The function of a {@link Route}.
 */
export const isAuthGuarded = (fn: Function) =>
    Reflect.hasMetadata(AuthMetadataKey, fn);
