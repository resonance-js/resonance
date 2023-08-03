import { Class } from '../../interface/class';
import { setMetadata } from '../../util/reflect';
import { getClassName } from '../util/reflect';
import { Module, ModuleCatalog } from '../module';

/** The name of the module. */
export const ModuleMetadataKey = 'resonance:module';

/** The module's base URL for routing. */
export const ModuleBasePathKey = 'resonance:baseurl';

export interface NcModule {
    routes?: Array<Class>;
    declarations?: Array<Class>;
    exports?: Array<Class>;
    imports?: Array<Class>;
    baseURL?: string;
}

/**
 * Module decorator and metadata.
 */
export const NcModule = (ncModule: NcModule) => {
    return function (instance: Class) {
        const moduleName = getClassName(instance);

        setMetadata(ModuleMetadataKey, moduleName, instance);
        setMetadata(ModuleBasePathKey, ncModule.baseURL, instance);

        ModuleCatalog.set(moduleName, new Module(instance, ncModule));
    };
};
