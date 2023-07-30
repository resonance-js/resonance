import { Class } from '../interface/class';
import { getMetadata } from '../util/reflect';
import { InjectableCatalog } from './catalogs';
import { getClassName } from './util/reflect';

/** The name of the injected class. */
export const InjectableMetadataKey = 'resonance:injectable';

/** The providedIn of the injected class. */
export const ProvidedInMetadataKey = 'resonance:providedin';

/**
 * Injectable decorator and metadata.
 */
export const Injectable = (opts?: { providedIn: 'root' | 'module' | null }) => {
    return (constructor: Class) => {
        InjectableCatalog.set(getClassName(constructor), constructor);
        Reflect.defineMetadata(
            InjectableMetadataKey,
            getClassName(constructor),
            constructor
        );
        Reflect.defineMetadata(
            ProvidedInMetadataKey,
            opts?.providedIn ?? 'module',
            constructor
        );
    };
};

export const getInjectedClassName = (instance: Class) =>
    getMetadata(InjectableMetadataKey, instance);

export const getInjectedProvidedIn = (instance: Class) =>
    getMetadata(ProvidedInMetadataKey, instance);
