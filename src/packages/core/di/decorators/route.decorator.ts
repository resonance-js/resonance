import { Class } from '../../interface/class';
import { setMetadata } from '../../util/reflect';
import { Route as _Route } from '../route';
import { RouteCatalog } from '../route';
import { getClassName, getInjectedDeps } from '../util/reflect';

/** The name of the injected class. */
export const RouteNameMetadataKey = 'resonance:route:name';

/** The providedIn of the injected class. */
export const RouteMetadataKey = 'resonance:route';

/**
 * Route decorator and metadata.
 */
export const Route = (route: string) => {
    return (instance: Class) => {
        const routeName = getClassName(instance);

        instance.prototype.name = routeName;
        instance.prototype.route = route;
        instance.prototype.injected = getInjectedDeps(instance);

        setMetadata(RouteNameMetadataKey, routeName);
        setMetadata(RouteMetadataKey, route);

        RouteCatalog.set(routeName, new _Route(instance, routeName, route));
    };
};
