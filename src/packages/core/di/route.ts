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

export type SupportedHttpMethod = 'get' | 'put' | 'post' | 'delete';

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
    public routeFnTree: {
        [fnName: string]: {
            httpMethod: SupportedHttpMethod;
            parameters: {
                [parameter: string]: string;
            };
        };
    } = {};

    constructor(reference: Class, name: string, _route: string) {
        super(reference, name, 'Route');

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
        const functions = getClassMembers(this.reference);

        Object.keys(functions)
            .filter((fnName) => functions[fnName] === 'function')
            .forEach((fnName) => {
                const httpMethod = this._getHttpMethod(fnName);
                if (httpMethod)
                    this.routeFnTree[fnName] = {
                        httpMethod,
                        parameters: getFunctionParameters(
                            this.reference.prototype[fnName]
                        ),
                    };
            });
    }

    private _getHttpMethod(fnKey: string): SupportedHttpMethod | null {
        const fnction = this.reference.prototype[fnKey];

        if (isGet(fnction)) return 'get';
        if (isPost(fnction)) return 'post';
        if (isPut(fnction)) return 'put';
        if (isDelete(fnction)) return 'delete';

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
