import { Class } from '../../core/src/interface/class';
import { HttpArgument } from '../../core/src/router';
import {
    getClassName,
    getInjectedDeps,
    setMetadata,
} from '../../core/src/reflect';
import { injectable_ref } from '../../core/src/di/injectable.decorator';
import { Route as _Route } from './route';
import { RouteCatalog } from './route';

/** The name of the injected class. */
export const RouteNameMetadataKey = 'triangular:route:name';

/** The providedIn of the injected class. */
export const RouteMetadataKey = 'triangular:route';

/**
 * Route decorator and metadata.
 */
export const Route = (route: string = '') => {
    return (instance: Class<any>) => {
        const routeName = getClassName(instance);

        instance.prototype.name = routeName;
        instance.prototype.route = route;
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(RouteNameMetadataKey, routeName, instance);
        setMetadata(RouteMetadataKey, route, instance);

        RouteCatalog.set(routeName, new _Route(instance, routeName, route));
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
