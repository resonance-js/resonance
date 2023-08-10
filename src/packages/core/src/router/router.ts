import express, { Request, Response } from 'express';
import { Route, RouteCatalog, SupportedHttpMethod } from '../di/route';
import {
    catchError,
    filter,
    isObservable,
    last,
    of,
    scan,
    throwError,
} from 'rxjs';
import { isHttpErrorResponse } from './interface/http-error-response';
import { NcLogger, cyan, gray, green, yellow } from '../log';
import { HttpArgument } from './interface/http-parameter-query';
import { deepCopy, isNonNullable } from '../../../cxjs';

const console = new NcLogger('RoutesMapper');

export function buildPath(routePath: string[], path: string) {
    const _path =
        '/' +
        [...routePath, path].filter((segment) => segment.length > 0).join('/');

    return _path;
}

export class NcRouter {
    public appExpress = express();

    constructor(public baseURL: string = 'api') {}

    public initializeRoutes(applicationRoutes: string[]) {
        applicationRoutes.forEach((routeName) => {
            RouteCatalog.getThen(routeName, (route) => {
                for (const fnName of route.fnsCatalog.keysArr) {
                    route.fnsCatalog.getThen(fnName, (val) => {
                        const path = buildPath(
                            [this.baseURL, ...route.path],
                            val.path
                        );
                        this._createEndpoint(
                            route,
                            val.httpMethod,
                            path,
                            fnName
                        );
                    });
                }
            });
        });
    }

    private _createEndpoint(
        route: Route,
        httpMethod: SupportedHttpMethod,
        path: string,
        fnName: string
    ) {
        this.appExpress[httpMethod](path, (req: Request, res: Response) => {
            this.handleResponse(
                route,
                fnName,
                route.reference.prototype.mapping[fnName]?.param ?? [],
                route.reference.prototype.mapping[fnName]?.query ?? [],
                req,
                res
            );
        });

        console.log(
            [
                yellow('[Mapped]'),
                green(httpMethod.toUpperCase()),
                cyan(path),
                gray('=>'),
                cyan(`${fnName}`),
                gray(`@`),
                cyan(route.name),
            ].join(' ')
        );
    }

    public handleResponse(
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

            route.fnsCatalog.getThen(fnName, (node) => {
                decoratedParams.forEach((p) => {
                    const param = req.params[p.name];
                    if (param) {
                        args[p.index] = this._parseHttpArgument(
                            param,
                            node.parameters[p.name]
                        );
                    } else if (p.required) {
                        missingParams.push(p.name);
                    }
                });

                const query = deepCopy<Record<string, any>>(req.query);

                decoratedQueries.forEach((q) => {
                    const _query = query[q.name];
                    if (query) {
                        args[q.index] = this._parseHttpArgument(
                            _query,
                            node.parameters[q.name]
                        );
                    } else if (q.required) {
                        missingParams.push(q.name);
                    }
                });
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

        if (isNonNullable(response) && isObservable(response)) {
            const subscriber = response
                .pipe(
                    filter(isNonNullable),
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
                    ),
                    scan((acc, next) => {
                        acc.push(next);
                        return acc;
                    }, [] as any[]),
                    last(),
                    catchError((err) =>
                        err.message.includes('no elements in sequence')
                            ? of([])
                            : throwError(() => err)
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
                        res.end();
                    },
                });

            req.on('close', () => subscriber.unsubscribe());
        } else if (isNonNullable(response)) {
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
                const parsed = parseInt(param);
                return isNaN(parsed) ? null : parsed;
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
