import express, { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { ResonanceConfig } from './resonance-config';
import {
    Server as SecureServer,
    createServer as createSecureServer,
} from 'https';
import { Server, createServer } from 'http';

import { Class } from '../interface/class';
import { GetMetadataKey } from '../http';
import { Module, ModuleCatalog } from '../di/module';
import { NcLogger } from '../log/logger';
import { getClassMembers, getMetadata } from '../util/reflect';
import { getClassName } from '../di/util/reflect';
import { green } from '../log/colorize';
import { $bootstrapped, $routesInitialized, $serverInitialized } from './lifecycle';

const console = new NcLogger('ResonanceApp');

export class Resonance {
    public appRef!: Module;
    public appExpress = express();
    public appServer?: Server | SecureServer;

    constructor(private _config: ResonanceConfig) {}

    boostrap(rootAppModule: Class) {
        this._bootstrap(rootAppModule);
        $bootstrapped.next(true);
        $bootstrapped.complete();

        this._initializeRoutes();
        $routesInitialized.next(true);
        $routesInitialized.complete();

        return this._initializeServer().pipe(
            tap(() => {
                $serverInitialized.next(true);
                $serverInitialized.complete();
            })
        );
    }

    private _bootstrap(appModule: Class) {
        const rootModuleName = getClassName(appModule);

        const appRef = ModuleCatalog.get(rootModuleName);

        if (appRef === undefined) {
            throw new Error(
                `Failed to initialize Resonance app root module ${rootModuleName}. Are you sure you provided the root module too bootstrap?`
            );
        }

        this.appRef = appRef;
    }

    private _initializeRoutes(modules?: Map<string, Module>) {
        (modules ?? this.appRef.imports).forEach((ncModule: Module) => {
            ncModule.routes.forEach((route) => {
                route.setModuleBaseRoute(ncModule.baseURL);
                route.setAppBaseRoute(this.appRef.baseURL);

                const classMembers = getClassMembers(route.route);
                Object.keys(classMembers).forEach((classMember) => {
                    if (classMembers[classMember] === 'function') {
                        const routeDefined = Reflect.hasMetadata(
                            GetMetadataKey,
                            route.route.prototype[classMember]
                        );

                        if (routeDefined) {
                            const methodRoute = [
                                ...route.path,
                                getMetadata(
                                    GetMetadataKey,
                                    route.route.prototype[classMember]
                                ),
                            ]
                                .filter((segment) => segment.length > 0)
                                .join('/');

                            this.appExpress.get(
                                methodRoute,
                                (req: Request, res: Response) => {
                                    console.log(req, res);
                                }
                            );
                        }
                    }
                });
            });

            if (ncModule.imports) {
                this._initializeRoutes(ncModule.imports);
            }
        });
    }

    private _initializeServer() {
        return new Observable<string>((observer) => {
            const callback = () => {
                observer.next(
                    green(
                        'Resonance is listening on port ' +
                            this._config.port +
                            '.'
                    )
                );
                observer.complete();
            };

            const server = this._config.credentials
                ? createSecureServer(this.appExpress)
                : createServer(this.appExpress);

            this.appServer =
                this._config.backlog !== undefined
                    ? server.listen(
                          this._config.port,
                          this._config.hostname ?? 'localhost',
                          this._config.backlog,
                          () => callback()
                      )
                    : server.listen(
                          this._config.port,
                          this._config.hostname ?? 'localhost',
                          () => callback()
                      );
        }).pipe(
            tap((msg) => {
                console.log(msg);
            })
        );
    }

    public exit() {
        return new Observable<string>((observer) => {
            if (this.appServer)
                this.appServer.close((err) => {
                    if (err) {
                        observer.error(err);
                    } else {
                        this.appServer?.closeAllConnections();
                        observer.next(
                            'Resonance exited for connection on port ' +
                                this._config.port
                        );
                        observer.complete();
                    }
                });
            else {
                observer.error(
                    'Failed to exit Resonance, as it was never started.'
                );
            }
        });
    }
}
