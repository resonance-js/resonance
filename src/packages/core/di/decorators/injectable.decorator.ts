import { Class } from '../../interface/class';
import { setMetadata } from '../../util/reflect';
import { Service, ServiceCatalog } from '../injectable';
import { getClassName, getInjectedDeps } from '../util/reflect';

/** The name of the injected class. */
export const InjectableMetadataKey = 'resonance:injectable';

/** The providedIn of the injected class. */
export const ProvidedInMetadataKey = 'resonance:providedin';

interface Injectable {
    providedIn: 'root' | 'module' | null;
}

/**
 * Injectable decorator and metadata.
 */
export const Injectable = (opts?: Injectable) => {
    return (instance: Class) => {
        const injectableName = getClassName(instance);

        instance.prototype.name = injectableName;
        instance.prototype.providedIn = opts?.providedIn ?? 'module';
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(InjectableMetadataKey, injectableName);
        setMetadata(ProvidedInMetadataKey, opts?.providedIn ?? 'module');

        ServiceCatalog.set(injectableName, new Service(instance));
    };
};
