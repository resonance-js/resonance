import { Class } from '../interface/class';
import { getClassName, setMetadata } from '../util/reflect';
import { ModuleCatalog, Module } from './module';

/** The name of the module. */
export const ModuleMetadataKey = 'resonance:module';

/** The module's base URL for routing. */
export const ModuleBasePathKey = 'resonance:baseurl';

export interface NcModule {
    routes?: Array<Class<any>>;
    declarations?: Array<Class<any>>;
    exports?: Array<Class<any>>;
    imports?: Array<Class<any>>;
    baseURL?: string;
}

/**
 * Module decorator and metadata.
 */
export const NcModule = (ncModule: NcModule) => {
    return function (instance: Class<any>) {
        const moduleName = getClassName(instance);

        setMetadata(ModuleMetadataKey, moduleName, instance);
        setMetadata(ModuleBasePathKey, ncModule.baseURL, instance);

        ModuleCatalog.set(moduleName, new Module(instance, ncModule));
    };
};

export interface module_ref {}
