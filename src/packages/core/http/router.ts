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
import { HttpArgument, HttpArguments } from './interface/http-parameter-query';

const console = new NcLogger('RoutesMapper');

export class NcRouter {
    public appExpress = express();

    constructor(public baseURL: string = 'api') {}

    public initializeRoute(route: Route, moduleBaseURL?: string) {
        route.setModuleBaseRoute(moduleBaseURL);
        route.setAppBaseRoute(this.baseURL);

        Object.keys(route.routeFnTree).forEach((fnName) => {
            const httpMethod = route.routeFnTree[fnName].httpMethod;
            const path = this._buildPath(route, fnName, httpMethod);
            const decoratedArgs: HttpArguments =
                route.reference.prototype.mapping[fnName];
            const decoratedParams: HttpArgument[] = decoratedArgs?.param ?? [];
            const decoratedQueries: HttpArgument[] = decoratedArgs?.query ?? [];

            this.appExpress[httpMethod](path, (req: Request, res: Response) =>
                this._handleResponse(
                    route,
                    fnName,
                    decoratedParams,
                    decoratedQueries,
                    req,
                    res
                )
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
        decoratedParams: HttpArgument[],
        decoratedQueries: HttpArgument[],
        req: Request,
        res: Response
    ) {
        res.setHeader('content-type', 'application/json');

        let response: any;

        if (decoratedParams.length + decoratedQueries.length > 0) {
            const args: any[] = [];
            const missingParams: string[] = [];
            const missingQueries: string[] = [];

            decoratedParams.forEach((p) => {
                const param = req.params[p.name];
                if (param) {
                    args[p.index] = this._parseHttpArgument(param, p.type);
                } else if (p.required) {
                    missingParams.push(p.name);
                }
            });

            decoratedQueries.forEach((q) => {
                const query = req.query[q.name];
                if (query) {
                    // TODO: Handle many query response types
                    // args[q.index] = this._parseHttpArgument(q.type, query);
                } else if (q.required) {
                    missingParams.push(q.name);
                }
            });

            if (missingParams.length + missingQueries.length > 0) {
                const error = [];

                if (missingParams.length > 0) {
                    error.push(
                        'Did not received required parameters: ',
                        missingParams.join(', ')
                    );
                }

                if (missingQueries.length > 0) {
                    error.push(
                        'Did not recieve required query parameters: ',
                        missingQueries.join(', ')
                    );
                }

                res.status(400).write({
                    statusCode: 400,
                    message: error.join('\n'),
                });
                res.end();
            } else {
                response = (route.instance as any)[fnName](...args);
            }
        } else {
            response = (route.instance as any)[fnName]();
        }

        if (isNotNull(response) && isObservable(response)) {
            const subscriber = response
                .pipe(
                    filter(isNotNull),
                    catchError((err) =>
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
                                      stack: err['stack'],
                                  }
                        )
                    )
                )
                .subscribe({
                    next: (next) => res.write(JSON.stringify(next)),
                    error: (err) => {
                        console.error(err.stack);
                        delete err.stack;
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

            req.on('close', () => subscriber.unsubscribe());
        } else if (isNotNull(response)) {
            if (typeof response === 'object') {
                res.write(JSON.stringify(response));
            } else {
                res.write(response);
            }
        } else {
            res.status(204);
        }

        res.end();
    }

    private _parseHttpArgument(param: string, type = 'string') {
        switch (type) {
            case 'array':
                return param.split(',');
            case 'number':
                return parseInt(param);
            case 'boolean':
                return param === 'true';
            case 'object':
                return JSON.stringify(param);
            case 'date':
                return new Date(param);
            default:
                return param;
        }
    }
}
