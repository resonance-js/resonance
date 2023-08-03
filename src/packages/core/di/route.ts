import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { getClassMembers, getFunctionParameters } from '../util/reflect';
import { isGet } from '../http';
import { isDelete } from '../http/decorators/delete.decorator';
import { isPost } from '../http/decorators/post.decorator';
import { isPut } from '../http/decorators/put.decorator';
import { Injectable } from './injectable';
import { ServiceCatalog } from './service';

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

export class Route extends Injectable {
    public path: string[];
    public routeMethodTree: {
        [fnName: string]: {
            httpMethod: string;
            parameters: {
                [parameter: string]: string;
            };
        };
    } = {};

    constructor(klass: Class, name: string, _route: string) {
        super(klass, name, 'Route');

        this.path = [_route];
        this._buildRouteMethodTree();
        this.init();
    }

    protected override _loadDependencyFromCatalog(
        dependencyName: string,
        index: number
    ): Injectable {
        const dependency = ServiceCatalog.get(dependencyName);

        if (!dependency) {
            throw new Error(
                `Failed to initialize dependency ${dependencyName} for ${this.injectableType} ${this.name} at index ${index}.`
            );
        }

        return dependency;
    }

    private _buildRouteMethodTree() {
        const functions = getClassMembers(this.klass);

        Object.keys(functions)
            .filter((fnName) => functions[fnName] === 'function')
            .forEach((fnName) => {
                const httpMethod = this._getHttpMethod(fnName);
                if (httpMethod)
                    this.routeMethodTree[fnName] = {
                        httpMethod,
                        parameters: getFunctionParameters(
                            this.klass.prototype[fnName]
                        ),
                    };
            });
    }

    private _getHttpMethod(
        fnKey: string
    ): 'GET' | 'PUT' | 'POST' | 'DELETE' | null {
        const fnction = this.klass.prototype[fnKey];

        if (isGet(fnction)) return 'GET';
        if (isPost(fnction)) return 'POST';
        if (isPut(fnction)) return 'PUT';
        if (isDelete(fnction)) return 'DELETE';

        return null;
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
