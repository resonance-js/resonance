import express, { Request, Response } from 'express';
import { Route, SupportedHttpMethod } from '../di/route';
import { getMetadata } from '../util/reflect';
import { PostMetadataKey } from './decorators/post.decorator';
import { PutMetadataKey } from './decorators/put.decorator';
import { DeleteMetadataKey } from './decorators/delete.decorator';
import { catchError, filter, isObservable, throwError } from 'rxjs';
import { isHttpErrorResponse } from './interface/http-error-response';
import { NcLogger, cyan, gray, green, yellow } from '../log';
import { isNotNull } from '../type/not-null';
import { GetMetadataKey } from './decorators';

const console = new NcLogger('RoutesMapper');

export class NcRouter {
    public appExpress = express();

    constructor(public baseURL: string = 'api') {}

    public initializeRoute(route: Route, moduleBaseURL?: string) {
        route.setModuleBaseRoute(moduleBaseURL);
        route.setAppBaseRoute(this.baseURL);

        console.log(route.reference.prototype);

        Object.keys(route.routeFnTree).forEach((fnName) => {
            const parameters = route.routeFnTree[fnName].parameters;
            const httpMethod = route.routeFnTree[fnName].httpMethod;
            const path = this._buildPath(route, fnName, httpMethod);

            this.appExpress[httpMethod](path, (req: Request, res: Response) =>
                this._handleResponse(route, fnName, parameters, req, res)
            );
        });
    }

    private _buildPath(
        route: Route,
        fnName: string,
        httpMethod: SupportedHttpMethod
    ) {
        switch (httpMethod) {
            case 'get':
                return this._buildFnRoute(
                    route,
                    fnName,
                    GetMetadataKey,
                    httpMethod
                );
            case 'put':
                return this._buildFnRoute(
                    route,
                    fnName,
                    PutMetadataKey,
                    httpMethod
                );
            case 'post':
                return this._buildFnRoute(
                    route,
                    fnName,
                    PostMetadataKey,
                    httpMethod
                );
            case 'delete':
                return this._buildFnRoute(
                    route,
                    fnName,
                    DeleteMetadataKey,
                    httpMethod
                );
        }
    }

    private _buildFnRoute(
        route: Route,
        fnName: string,
        metadataKey: string,
        type: string
    ) {
        const path =
            '/' +
            [
                ...route.path,
                getMetadata(metadataKey, route.reference.prototype[fnName]),
            ]
                .filter((segment) => segment.length > 0)
                .join('/');

        console.log(
            [
                yellow('[Mapped]'),
                green(type.toUpperCase()),
                cyan(path),
                gray('=>'),
                cyan(`${fnName}`),
                gray(`@`),
                cyan(route.name),
            ].join(' ')
        );
        return path;
    }

    private _handleResponse(
        route: Route,
        fnName: string,
        parameters: Record<string, any>,
        req: Request,
        res: Response
    ) {
        let response: any;
        res.setHeader('content-type', 'application/json');

        const argsKeys = Object.keys(parameters);

        // TODO: fix issue where params are not applied to endpoints. Use the mapping
        // TODO: from the param and query decorators.
        console.log(req.params, req.query);
        if (argsKeys.length > 0) {
            const args: any[] = [];

            const paramKeys = Object.keys(req.params);
            // const queryKeys = Object.keys(req.query);

            argsKeys.forEach((param) => {
                if (paramKeys.includes(param)) {
                    args.push(req.params[param]);
                }
            });

            response = (route.instance as any)[fnName](...args);
        } else {
            response = (route.instance as any)[fnName]();
        }

        if (isObservable(response)) {
            const subscriber = response
                .pipe(
                    filter(isNotNull),
                    catchError((err) =>
                        // TODO Instead of returning the stack, print it out here to a router log
                        throwError(() =>
                            isHttpErrorResponse(err)
                                ? {
                                      statusCode: err.statusCode,
                                      message: err.message,
                                      stack: err.stack['stack'] ?? err.stack,
                                  }
                                : {
                                      status: 500,
                                      message: `Something went wrong and we couldn't complete your request.`,
                                      error: err['stack'],
                                  }
                        )
                    )
                )
                .subscribe({
                    next: (next) => {
                        res.write(JSON.stringify(next));
                    },
                    error: (err) => {
                        res.status(err.statusCode ?? 500).write(
                            JSON.stringify(err)
                        );
                        res.end();
                    },
                    complete: () => {
                        console.log('done');
                        res.end();
                    },
                });

            req.on('close', () => {
                subscriber.unsubscribe();
            });
        } else {
            // TODO verify an object is being sent
            res.write(JSON.stringify(response));
            res.end();
        }
    }
}
