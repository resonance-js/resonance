import express, { Request, Response } from 'express';
import { Route } from '../di/route';
import {
    getClassMembers,
    getFunctionParameters,
    getMetadata,
} from '../util/reflect';
import { GetMetadataKey } from './decorators';
import { PostMetadataKey } from './decorators/post.decorator';
import { PutMetadataKey } from './decorators/put.decorator';
import { DeleteMetadataKey } from './decorators/delete.decorator';
import { isObservable } from 'rxjs';
import { isHttpErrorResponse } from './interface/http-error-response';
import { NcLogger } from '../log';

const console = new NcLogger('RoutesMapper');

export class NcRouter {
    public appExpress = express();

    constructor(public baseURL: string = 'api') {}

    public initializeRoute(route: Route, moduleBaseURL?: string) {
        route.setModuleBaseRoute(moduleBaseURL);
        route.setAppBaseRoute(this.baseURL);

        const classMembers = getClassMembers(route.klass);

        Object.keys(classMembers).forEach((classMemberKey) => {
            switch (this._getHttpMethod(route, classMemberKey)) {
                case 'GET':
                    this.get(route, classMemberKey);
                    break;
                case 'PUT':
                    this.put(route, classMemberKey);
                    break;
                case 'DELETE':
                    this.delete(route, classMemberKey);
                    break;
                case 'POST':
                    this.post(route, classMemberKey);
                    break;
            }
        });
    }

    private _getHttpMethod(
        route: Route,
        classMemberKey: string
    ): 'GET' | 'PUT' | 'POST' | 'DELETE' | null {
        if (
            typeof route.klass.prototype[classMemberKey] !== 'function' ||
            route.instance === null ||
            route.instance === undefined
        )
            return null;

        if (
            Reflect.hasMetadata(
                GetMetadataKey,
                route.klass.prototype[classMemberKey]
            )
        )
            return 'GET';

        if (
            Reflect.hasMetadata(
                PostMetadataKey,
                route.klass.prototype[classMemberKey]
            )
        )
            return 'POST';

        if (
            Reflect.hasMetadata(
                PutMetadataKey,
                route.klass.prototype[classMemberKey]
            )
        )
            return 'PUT';

        if (
            Reflect.hasMetadata(
                DeleteMetadataKey,
                route.klass.prototype[classMemberKey]
            )
        )
            return 'DELETE';

        return null;
    }

    public get(route: Route, classMemberKey: string) {
        const path = this._buildMethodRoute(
            route,
            classMemberKey,
            GetMetadataKey
        );

        const parameters = getFunctionParameters(
            route.klass.prototype[classMemberKey]
        );

        this.appExpress.get(path, (req: Request, res: Response) => {
            this._handleResponse(route, classMemberKey, parameters, req, res);
        });

        console.log('Mapped GET to ' + path + '.');
    }

    public put(route: Route, classMemberKey: string) {
        const path = this._buildMethodRoute(
            route,
            classMemberKey,
            PutMetadataKey
        );

        const parameters = getFunctionParameters(
            route.klass.prototype[classMemberKey]
        );

        this.appExpress.put(path, (req: Request, res: Response) => {
            this._handleResponse(route, classMemberKey, parameters, req, res);
        });

        console.log('Mapped PUT to ' + path + '.');
    }

    public post(route: Route, classMemberKey: string) {
        const path = this._buildMethodRoute(
            route,
            classMemberKey,
            PostMetadataKey
        );

        const parameters = getFunctionParameters(
            route.klass.prototype[classMemberKey]
        );

        this.appExpress.post(path, (req: Request, res: Response) => {
            this._handleResponse(route, classMemberKey, parameters, req, res);
        });

        console.log('Mapped POST to ' + path + '.');
    }

    public delete(route: Route, classMemberKey: string) {
        const path = this._buildMethodRoute(
            route,
            classMemberKey,
            DeleteMetadataKey
        );

        const parameters = getFunctionParameters(
            route.klass.prototype[classMemberKey]
        );

        this.appExpress.delete(path, (req: Request, res: Response) => {
            this._handleResponse(route, classMemberKey, parameters, req, res);
        });

        console.log('Mapped DELETE to ' + path + '.');
    }

    private _buildMethodRoute(
        route: Route,
        classMemberKey: string,
        metadataKey: string
    ) {
        return (
            '/' +
            [
                ...route.path,
                getMetadata(metadataKey, route.klass.prototype[classMemberKey]),
            ]
                .filter((segment) => segment.length > 0)
                .join('/')
        );
    }

    private _handleResponse(
        route: Route,
        classMemberKey: string,
        parameters: Record<string, any>,
        req: Request,
        res: Response
    ) {
        let response: any;

        const argsKeys = Object.keys(parameters);

        if (argsKeys.length > 0) {
            const args: any[] = [];

            const paramKeys = Object.keys(req.params);
            // const queryKeys = Object.keys(req.query);

            argsKeys.forEach((param) => {
                if (paramKeys.includes(param)) {
                    args.push(req.params[param]);
                }
            });

            response = (route.instance as any)[classMemberKey](...args);
        } else {
            response = (route.instance as any)[classMemberKey]();
        }

        if (isObservable(response)) {
            const setStatus = false;

            const subscriber = response.subscribe({
                next: (next) => {
                    if (!setStatus) res.status(200);
                    res.write(JSON.stringify(next));
                },
                error: (err) => {
                    if (isHttpErrorResponse(err)) {
                        res.status(err.statusCode).write(
                            JSON.stringify({
                                message: err.message,
                                stack: err.stack['stack'] ?? err.stack,
                            })
                        );
                    } else {
                        res.status(500).write(
                            JSON.stringify({
                                status: 500,
                                message: `Something went wrong and we couldn't complete your request.`,
                                error: err['stack'],
                            })
                        );
                    }

                    res.end();
                },
                complete: () => {
                    res.end();
                },
            });

            req.on('close', () => {
                subscriber.unsubscribe();
            });
        } else {
            res.status(200).write(JSON.stringify(response));
            res.end();
        }
    }
}
