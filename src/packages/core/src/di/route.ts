import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { getClassMembers, getFunctionParameters } from '../util/reflect';
import { isDelete } from '../router/delete.decorator';
import { isGet } from '../router/get.decorator';
import { isPost } from '../router/post.decorator';
import { isPut } from '../router/put.decorator';
import { route_ref } from './route.decorator';
import { RouteTreeNode } from '../router/interface/route-tree-node';
import { _Injectable } from './injectable';

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

export class Route extends _Injectable<route_ref> {
    public path: string[];
    public routeFnsMap = new Map<string, RouteTreeNode>();

    constructor(reference: Class<route_ref>, name: string, _route: string) {
        super(reference, name, 'Route');

        this.path = [_route];
        this._buildRouteMethodTree();
    }

    private _buildRouteMethodTree() {
        const functions = getClassMembers(this.reference);

        Object.keys(functions)
            .filter((fnName) => functions[fnName] === 'function')
            .forEach((fnName) => {
                const httpMethod = this._getHttpMethod(fnName);
                if (httpMethod)
                    this.routeFnsMap.set(fnName, {
                        httpMethod,
                        parameters: getFunctionParameters(
                            this.reference.prototype[fnName]
                        ),
                    });
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
