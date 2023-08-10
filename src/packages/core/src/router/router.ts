import express, { Request, Response } from 'express';
import { Route, RouteCatalog, SupportedHttpMethod } from '../di/route';
import {
    NEVER,
    catchError,
    filter,
    isObservable,
    last,
    map,
    of,
    scan,
    throwError,
} from 'rxjs';
import {
    HttpErrorResponse,
    isHttpErrorResponse,
} from './interface/http-error-response';
import { NcLogger, cyan, gray, green, yellow } from '../log';
import { HttpArgument } from './interface/http-parameter-query';
import { deepCopy, isNonNullable } from '../../../cxjs';
import { BasicAuthHandler } from '../auth/basic_handler';
import { AuthHandler } from '../auth/handler';
import { Catalog } from '../util';
import {
    AuthLifecycleFnNames,
    implementsBasicAuth,
    implementsBearerAuth,
} from '../auth';
import { BearerAuthHandler } from '../auth/bearer_handler';

const console = new NcLogger('RoutesMapper');

export function buildPath(routePath: string[], path: string) {
    const _path =
        '/' +
        [...routePath, path].filter((segment) => segment.length > 0).join('/');

    return _path;
}

export class NcRouter {
    public appExpress = express();

    public authHandlerCatalog = new Catalog<string, AuthHandler>();

    constructor(public baseURL: string = 'api') {}

    public initializeRoutes(applicationRoutes: string[]) {
        applicationRoutes.forEach((routeName) => {
            RouteCatalog.getThen(routeName, (route) => {
                this._evalForAuthHandler(route);
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

    // TODO for some reason the router isn't picking up the auth handlers
    private _evalForAuthHandler(route: Route) {
        if (implementsBasicAuth(route.reference.prototype, route.instance)) {
            this.authHandlerCatalog.set(
                route.name,
                new BasicAuthHandler('ncOnBasicAuthRequest', route.name)
            );
        } else if (
            implementsBearerAuth(route.reference.prototype, route.instance)
        ) {
            this.authHandlerCatalog.set(
                route.name,
                new BearerAuthHandler('ncOnBearerTokenRequest', route.name)
            );
        }
    }

    private _createEndpoint(
        route: Route,
        httpMethod: SupportedHttpMethod,
        path: string,
        fnName: string
    ) {
        let paramMapping: any[] = [];
        let queryMapping: any[] = [];

        try {
            paramMapping = route.reference.prototype.mapping[fnName]?.param;
        } catch {}

        try {
            queryMapping = route.reference.prototype.mapping[fnName]?.query;
        } catch {}

        const authGuarded = route.fnsCatalog.get(fnName)?.authGuard ?? null;
        const authGuard = authGuarded
            ? AuthLifecycleFnNames[authGuarded]
            : null;
        const authHandler =
            this.authHandlerCatalog.getIfNonNullableKey(authGuard);

        this.appExpress[httpMethod](path, (req: Request, res: Response) => {
            if (authHandler) {
                authHandler.onRequest(req).pipe(
                    this._catchAuthError(res),
                    map(() => {
                        this.handleResponse(
                            route,
                            fnName,
                            paramMapping,
                            queryMapping,
                            req,
                            res
                        );
                    })
                );
            } else {
                this.handleResponse(
                    route,
                    fnName,
                    paramMapping,
                    queryMapping,
                    req,
                    res
                );
            }
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

    private _catchAuthError(res: Response) {
        return catchError((err) => {
            let handlerRes: HttpErrorResponse = isHttpErrorResponse(err)
                ? err
                : {
                      message: `Something went wrong, and we couldn't complete your request`,
                      statusCode: 500,
                  };

            if (typeof err === 'string') {
                console.error(err);
            } else if (typeof err === 'object') {
                handlerRes.response = err;
            }

            res.status(handlerRes.statusCode)
                .send(JSON.stringify(handlerRes))
                .end();

            return NEVER;
        });
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
                res.write(`${response}`);
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
