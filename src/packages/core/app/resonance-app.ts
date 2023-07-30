import { Observable, Subject, tap } from 'rxjs';
import {
    InjectableCatalog,
    ModuleCatalog,
} from '../di/catalogs';
import { getClassName } from '../di/util/reflect';
import { Class } from '../interface/class';
import { ResonanceConfig } from './resonance-config';

import express from 'express';
import { $log, NcLogger } from '../log/logger';
import { InjectableNode } from '../di/interface';

new NcLogger('ResonanceApp');

export const onBootstrap = new Subject<void>();

export class Resonance {
    private _app = express();

    private _$onListen = new Subject<void>();
    private _listenSubscription = this._$onListen
        .pipe(
            tap(() =>
                $log.next('Resonance is listening on port ' + this._config.port)
            )
        )
        .subscribe();

    constructor(private _config: ResonanceConfig) {}

    boostrap(appModule: Class) {
        const className = getClassName(appModule);
        const rootModule = ModuleCatalog.get(className);

        // console.log(ModuleCatalog);

        // rootModule?.imports?.forEach((imprt) => {
        // console.log(ModuleCatalog.get(imprt));
        // });

        this._compileInjectables();
        onBootstrap.next();
        this._createExpressServer();
    }

    private _compileInjectables() {
        const hasDependencies: InjectableNode[] = [];
        const initialized: string[] = [];

        InjectableCatalog.forEach((node, key) => {
            if (node.dependencies.length > 0) {
                hasDependencies.push(node);
            } else {
                node.instance = new node.class();
                $log.next(getClassName(node.class) + ' Initialized');
                initialized.push(key);
            }
        });

        hasDependencies.forEach((node) => {
            const depsInitialized = node.dependencies.every((dep) => {
                return initialized.includes(dep);
            });

            // One issue where having here is that if
            // serviceA --> serviceB
            // serviceB --> has deps
            // serviceA cannot be initialized before serviceB. Ugh.
            // I think we need an actual dependency tree that just lists
            // the names of dependencies that we climb down to initialize the app.
            if (depsInitialized) {
                const args = node.dependencies.map(
                    (depName) => InjectableCatalog.get(depName)?.instance
                );
                node.instance = new node.class(...args);
                $log.next(getClassName(node.class) + ' Initialized');
                initialized.push(getClassName(node.class));
            } else {
                throw new Error(
                    'Failed to initialize dependency for ' +
                        getClassName(node.class)
                );
            }
        });
    }

    private _createExpressServer() {
        this._config.backlog
            ? this._app.listen(
                  this._config.port,
                  this._config.hostname ?? 'localhost',
                  this._config.backlog,
                  () => this._$onListen.next()
              )
            : this._app.listen(
                  this._config.port,
                  this._config.hostname ?? 'localhost',
                  () => this._$onListen.next()
              );
    }
}
