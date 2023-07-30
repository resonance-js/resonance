import { getClassName } from './util/reflect';

export const RouteNameMetadataKey = 'resonance:route:name';
export const RouteMetadataKey = 'resonance:route';

/**
 * Injectable decorator and metadata.
 */
export const Route = (route: string) => {
    return (constructor: Function) => {
        Reflect.defineMetadata(
            RouteNameMetadataKey,
            getClassName(constructor),
            constructor
        );
        Reflect.defineMetadata(RouteMetadataKey, route, constructor);
    };
};
