import { getClassName, injectable_ref, setMetadata } from '@resonance/core';
import { Schema } from 'yaml';
import { Class } from '../../core/src/interface/class';
import { HttpArgument } from '../router';
import { ControllerCatalog } from './controller';

/** The name of the injected class. */
export const ControllerNameMetadataKey = 'resonance:route:name';

/** The providedIn of the injected class. */
export const ControllerMetadataKey = 'resonance:route';

export interface Controller<T> {
    path: string;
    schema: Schema<T>[];
}

/**
 * Route decorator and metadata.
 */
export const Controller = <T>(options: Controller<T>) => {
    return (instance: Class<any>) => {
        const routeName = getClassName(instance);

        instance.prototype.name = routeName;
        instance.prototype.route = options.path;
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(ControllerNameMetadataKey, routeName, instance);
        setMetadata(ControllerMetadataKey, options.path, instance);

        ControllerCatalog.set(
            routeName,
            new _Controller<T>(instance, options.path, options.schema)
        );
    };
};

export interface route_ref extends injectable_ref {
    route: string;
    mapping: Record<
        string,
        {
            param: HttpArgument[];
            query: HttpArgument[];
        }
    >;
    ncOnBasicAuthRequest?: Function;
}
