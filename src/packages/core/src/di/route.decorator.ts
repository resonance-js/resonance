import { Class } from '../interface/class';
import { HttpArgument } from '../router';
import { getClassName, getInjectedDeps, setMetadata } from '../util/reflect';
import { injectable_ref } from './injectable.decorator';
import { Route as _Route } from './route';
import { RouteCatalog } from './route';

/** The name of the injected class. */
export const RouteNameMetadataKey = 'resonance:route:name';

/** The providedIn of the injected class. */
export const RouteMetadataKey = 'resonance:route';

/**
 * Route decorator and metadata.
 */
export const Route = (route: string = '') => {
    return (instance: Class<route_ref>) => {
        const routeName = getClassName(instance);

        instance.prototype.name = routeName;
        instance.prototype.route = route;
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(RouteNameMetadataKey, routeName);
        setMetadata(RouteMetadataKey, route);

        RouteCatalog.set(routeName, new _Route(instance, routeName, route));
    };
};

export interface route_ref extends injectable_ref {
    name: string;
    route: string;
    injected: string[];
    mapping: Record<
        string,
        {
            param: HttpArgument[];
            query: HttpArgument[];
        }
    >;
}
