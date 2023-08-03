import { Observable, tap } from 'rxjs';
import { ResonanceConfig } from './resonance-config';
import {
    Server as SecureServer,
    createServer as createSecureServer,
} from 'https';
import { Server, createServer } from 'http';

import { Class } from '../interface/class';
import { Module, ModuleCatalog } from '../di/module';
import { NcLogger } from '../log/logger';
import { getClassName } from '../di/util/reflect';
import { green } from '../log/colorize';
import {
    $bootstrapped,
    $routesInitialized,
    $serverInitialized,
} from './lifecycle';
import { NcRouter } from '../http/router';
import { Route } from '../di/route';

const console = new NcLogger('ResonanceApp');

export class Resonance {
    public appRef!: Module;

    public appServer?: Server | SecureServer;
    public router!: NcRouter;

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

    public routes: Route[] = [];

    private _initializeRoutes(modules?: Map<string, Module>) {
        this.router = new NcRouter(this.appRef.baseURL);

        (modules ?? this.appRef.imports).forEach((ncModule: Module) => {
            ncModule.$onInit.next$.subscribe(() => {
                ncModule.routes.forEach((route) => {
                    this.router.initializeRoute(route);
                });

                if (Object.keys(ncModule.imports).length > 0) {
                    this._initializeRoutes(ncModule.imports);
                }
            });
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

            this.router.appExpress.get('/api');

            const server = this._config.credentials
                ? createSecureServer(this.router.appExpress)
                : createServer(this.router.appExpress);

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
