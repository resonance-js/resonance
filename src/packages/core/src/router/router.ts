import express, { Request, Response } from 'express';
import { Route } from '../di/route';
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

export class NcRouter {
    public appExpress = express();

    constructor(public baseURL: string = 'api') {}

    public initializeRoute(route: Route, moduleBaseURL?: string) {
        if (moduleBaseURL) route.path.unshift(moduleBaseURL);
        route.path.unshift(this.baseURL);

        route.onInit$.subscribe(() => {
            for (const fnName of route.fnsCatalog.keysArr) {
                route.fnsCatalog.getThen(fnName, (val) => {
                    this.appExpress[val.httpMethod](
                        this._buildPath(
                            route,
                            fnName,
                            val.path,
                            val.httpMethod
                        ),
                        (req: Request, res: Response) => {
                            this._handleResponse(
                                route,
                                fnName,
                                route.reference.prototype.mapping[fnName]
                                    ?.param ?? [],
                                route.reference.prototype.mapping[fnName]
                                    ?.query ?? [],
                                req,
                                res
                            );
                        }
                    );
                });
            }
        });
    }

    private _buildPath(
        route: Route,
        fnName: string,
        path: string,
        httpMethodName: string
    ) {
        const _path =
            '/' +
            [...route.path, path]
                .filter((segment) => segment.length > 0)
                .join('/');

        console.log(
            [
                yellow('[Mapped]'),
                green(httpMethodName.toUpperCase()),
                cyan(_path),
                gray('=>'),
                cyan(`${fnName}`),
                gray(`@`),
                cyan(route.name),
            ].join(' ')
        );
        return _path;
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
