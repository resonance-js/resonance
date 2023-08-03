import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { Service, ServiceCatalog } from './injectable';

export const RouteNameMetadataKey = 'resonance:route:name';
export const RouteMetadataKey = 'resonance:route';

class _RouteCatalog extends Map<string, Route> {
    public onChange = new Subject<Route>();
    override set(key: string, route: Route) {
        super.set(key, route);
        this.onChange.next(route);
        return this;
    }
}

export const RouteCatalog = new _RouteCatalog();

export class Route {
    public instance?: Class;
    public dependencies: Service[] = [];
    public path: string[];

    constructor(
        public route: Class,
        public name: string,
        _route: string
    ) {
        this.path = [_route];

        (route.prototype.injected as string[]).forEach(
            (dependencyName, index) => {
                const dependency = ServiceCatalog.get(dependencyName);

                if (!dependency) {
                    throw new Error(
                        `Failed to initialize dependency ${dependencyName} for Route ${this.name} at index ${index}.`
                    );
                }

                this.dependencies.push(dependency);
            }
        );
    }

    public initializeInstance(...args: any[]) {
        this.instance = new this.route(...args);
    }

    /**
     * Sets the app base route.
     * @param route Unshifts the app's base route.
     * @returns this
     */
    public setModuleBaseRoute(route?: string) {
        return this._unshiftRoute(route);
    }

    /**
     * Sets the app base route.
     * @param route Unshifts the app's base route.
     * @returns this
     */
    public setAppBaseRoute(route?: string) {
        return this._unshiftRoute(route);
    }

    private _unshiftRoute(route?: string) {
        if (route) {
            this.path.unshift(route);
        }

        return this;
    }
}
