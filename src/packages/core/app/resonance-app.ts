import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Class } from '../interface/class';
import { ResonanceConfig } from './resonance-config';

import express from 'express';
import { NcLogger } from '../log/logger.service';
import { Server } from 'http';
import { getClassName } from '../di/util/reflect';
import { Module, ModuleCatalog } from '../di/module';
import { green } from '../log/colorize';

const console = new NcLogger('ResonanceApp');

export const $bootstrapped = new BehaviorSubject<boolean>(false);
export const $serverInitialized = new BehaviorSubject<boolean>(false);

export class Resonance {
    public appRef!: Module;
    public server?: Server;

    private _app = express();

    constructor(private _config: ResonanceConfig) {}

    boostrap(appModule: Class) {
        const rootModuleName = getClassName(appModule);
        const appRef = ModuleCatalog.get(rootModuleName);

        if (appRef === undefined) {
            throw new Error(
                `Failed to initialize Resonance app root module ${rootModuleName}. Are you sure you provided the root module too bootstrap?`
            );
        }

        this.appRef = appRef;

        $bootstrapped.next(true);
        $bootstrapped.complete();

        return this._createExpressServer().pipe(
            map((msg) => {
                this._initializeRoutes();
                return msg;
            })
        );
    }

    private _createExpressServer() {
        return new Observable<string>((observer) => {
            const callback = () => {
                $serverInitialized.next(true);
                $serverInitialized.complete();
                observer.next(
                    green(
                        'Resonance is listening on port ' +
                            this._config.port +
                            '.'
                    )
                );
                observer.complete();
            };

            this.server =
                this._config.backlog !== undefined
                    ? this._app.listen(
                          this._config.port,
                          this._config.hostname ?? 'localhost',
                          this._config.backlog,
                          () => callback()
                      )
                    : this._app.listen(
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

    private _initializeRoutes(modules?: Map<string, Module>) {
        (modules ?? this.appRef.imports).forEach((ncModule: Module) => {
            ncModule.routes.forEach((route) => {
                route.setModuleBaseRoute(ncModule.baseURL);
                route.setAppBaseRoute(this.appRef.baseURL);
                console.log(route.path);
            });

            if (ncModule.imports) {
                this._initializeRoutes(ncModule.imports);
            }
        });
    }

    public exit() {
        return new Observable<string>((observer) => {
            if (this.server)
                this.server.close((err) => {
                    if (err) {
                        observer.error(err);
                    } else {
                        this.server?.closeAllConnections();
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
