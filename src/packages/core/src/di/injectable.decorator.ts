import { Class } from '../interface/class';
import { getClassName, getInjectedDeps, setMetadata } from '../util/reflect';
import {
    InjectableCatalog,
    Injectable as InjectableClass,
    _injectable_ref,
} from './injectable';

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
    return (instance: Class<any>) => {
        const injectableName = getClassName(instance);

        instance.prototype.name = injectableName;
        instance.prototype.providedIn = opts?.providedIn ?? 'module';
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(InjectableMetadataKey, injectableName);
        setMetadata(ProvidedInMetadataKey, opts?.providedIn ?? 'module');

        InjectableCatalog.set(injectableName, new InjectableClass(instance));
    };
};

export interface injectable_ref extends _injectable_ref {
    name: string;
    providedIn: 'root' | 'module' | null;
    injected: string[];
}
