import { Class } from '../interface/class';
import {
    getClassMembers,
    getFunctionParameters,
    getMetadata,
} from '../util/reflect';
import { DeleteMetadataKey, isDelete } from '../router/delete.decorator';
import { GetMetadataKey, isGet } from '../router/get.decorator';
import { PostMetadataKey, isPost } from '../router/post.decorator';
import { PutMetadataKey, isPut } from '../router/put.decorator';
import { route_ref } from './route.decorator';
import { RouteTreeNode } from '../router/interface/route-tree-node';
import { _Injectable } from './injectable';
import { Catalog } from '../util';

export const RouteNameMetadataKey = 'resonance:route:name';
export const RouteMetadataKey = 'resonance:route';

export type SupportedHttpMethod = 'get' | 'put' | 'post' | 'delete';

export const RouteCatalog = new Catalog<string, Route>();

export class Route extends _Injectable<route_ref> {
    public path: string[];
    public fnsCatalog = new Catalog<string, RouteTreeNode>();

    constructor(reference: Class<route_ref>, name: string, route: string) {
        super(reference, name, 'Route');
        this.path = [route];
        this._buildFnNodes();
        this.init();
    }

    private _buildFnNodes() {
        const functions = getClassMembers(this.reference);
        Object.keys(functions)
            .filter(
                (fnName) =>
                    functions[fnName] === 'function' && fnName !== 'constructor'
            )
            .forEach((fnName) => {
                this.fnsCatalog.setIfNonNullable(
                    fnName,
                    this._buildFnNode(fnName)
                );
            });
    }

    private _buildFnNode(fnName: string): RouteTreeNode | null {
        const fn = this.reference.prototype[fnName];
        const parameters: Record<string, string> = {};

        const fnTypes = getFunctionParameters(this.reference.prototype, fnName);
        (this.reference.prototype[fnName].toString() as string)
            .split('(')[1]
            .split(')')[0]
            .split(',')
            .filter((val) => val.length > 0)
            .forEach((val, index) => {
                parameters[val] = fnTypes[index];
            });

        let httpMethod: SupportedHttpMethod | undefined;
        let metadataKey: string | undefined;

        if (isGet(fn)) {
            httpMethod = 'get';
            metadataKey = GetMetadataKey;
        }

        if (isPost(fn)) {
            httpMethod = 'post';
            metadataKey = PostMetadataKey;
        }

        if (isPut(fn)) {
            httpMethod = 'put';
            metadataKey = PutMetadataKey;
        }

        if (isDelete(fn)) {
            httpMethod = 'delete';
            metadataKey = DeleteMetadataKey;
        }

        if (httpMethod && metadataKey) {
            const name = getMetadata(
                metadataKey,
                this.reference.prototype[fnName]
            );

            return {
                httpMethod,
                metadataKey,
                parameters,
                path: name ?? '',
            };
        }

        return null;
    }
}
