import { Class } from '../../interface/class';
import { getMetadata, setMetadata } from '../../util/reflect';
import { getClassName, getInjectedDeps } from '../util/reflect';

/** The name of the injected class. */
export const InjectableMetadataKey = 'resonance:injectable';

/** The providedIn of the injected class. */
export const ProvidedInMetadataKey = 'resonance:providedin';

export interface Injectable {
    providedIn: 'root' | 'module' | null;
    providerName?: string;
}

/**
 * Injectable decorator and metadata.
 */
export const Injectable = (opts?: Injectable) => {
    return (instance: Class) => {
        const injectableName = getClassName(instance);

        instance.prototype.name = injectableName;
        instance.prototype.providedIn = opts?.providedIn ?? 'module';
        instance.prototype.imports = getInjectedDeps(instance);

        // console.log(instance.prototype);

        setMetadata(InjectableMetadataKey, injectableName);
        setMetadata(ProvidedInMetadataKey, opts?.providedIn ?? 'module');
    };
};

export const getInjectedClassName = (instance: Class) =>
    getMetadata(InjectableMetadataKey, instance);

export const getInjectedProvidedIn = (instance: Class) =>
    getMetadata(ProvidedInMetadataKey, instance);
