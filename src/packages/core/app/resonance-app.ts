import { Observable, Subject, map, of, timeout } from 'rxjs';
import { Class } from '../interface/class';
import { ResonanceConfig } from './resonance-config';

import express from 'express';
import { NcLogger } from '../log/logger';
import { Server } from 'http';
// import { ServiceCatalog } from '../di/injectable';
// import { ModuleCatalog } from '../di/module';

new NcLogger('ResonanceApp');

export const onBootstrap = new Subject<boolean>();

export class Resonance {
    private _app = express();
    private _server?: Server;
    public appRef?: any;

    constructor(private _config: ResonanceConfig) {}

    // private dependencyTree: any = {};

    boostrap(appModule: Class) {
        // console.log(appModule);
        // const rootModule = ModuleCatalog.get(getClassName(appModule));
        // rootModule?.imports?.map((imprt) => {
        // console.log(ModuleCatalog.get(imprt));
        // });
        // console.log(rootModule);
        // const dependencyTree = this._buildDependencyTree(
        //     getClassName(appModule)
        // );

        // console.log(dependencyTree);
        // if (dependencyTree.imports)
        //     console.log(dependencyTree.imports['ForceUserModule']);
        this.appRef = new appModule();

        of('').pipe(
            timeout(500),
            map(() => {
                console.log(this.appRef);

                onBootstrap.next(true);
            })
        );

        // console.log(ModuleCatalog);
        // console.log(ServiceCatalog);
        // this._compileInjectables();
        return this._createExpressServer();
    }

    // private _buildDependencyTree(
    //     moduleNameOrClassName: string,
    //     isModule = true
    // ) {
    //     const dependencyNode: {
    //         imports?: Record<string, any>;
    //         declarations?: Record<string, any>;
    //         exports?: Record<string, any>;
    //         routes?: Record<string, any>;
    //         dependencies?: Record<string, any>;
    //     } = {};

    //     if (isModule) {
    //         const module = ModuleCatalog.get(moduleNameOrClassName);

    //         if (module) {
    //             console.log(module);
    //             if (module.imports) {
    //                 dependencyNode.imports = {};

    //                 module.imports.forEach((imprt) => {
    //                     if (dependencyNode.imports)
    //                         dependencyNode.imports[imprt] =
    //                             this._buildDependencyTree(imprt);
    //                 });
    //             }

    //             if (module.declarations) {
    //                 dependencyNode.declarations = {};

    //                 Object.keys(module.declarations).forEach(
    //                     (declarationKey) => {
    //                         if (dependencyNode.declarations)
    //                             dependencyNode.declarations[declarationKey] =
    //                                 this._buildDependencyTree(
    //                                     declarationKey,
    //                                     false
    //                                 );
    //                     }
    //                 );
    //             }
    //         }
    //     } else {
    //         const injectable = InjectableCatalog.get(moduleNameOrClassName);

    //         if (injectable) {
    //             console.log(injectable);
    //             if (injectable.dependencies) {
    //                 dependencyNode.dependencies = {};

    //                 injectable?.dependencies.forEach((dep) => {
    //                     if (dependencyNode.dependencies)
    //                         dependencyNode.dependencies[dep] =
    //                             this._buildDependencyTree(dep, false);
    //                 });
    //             }
    //         }
    //     }

    //     return dependencyNode;
    // }

    // public _compileInjectables() {
    //     const hasDependencies: InjectableNode[] = [];
    //     const initialized: string[] = [];

    //     InjectableCatalog.forEach((node, key) => {
    //         if (node.dependencies.length > 0) {
    //             hasDependencies.push(node);
    //         } else {
    //             node.instance = new node.class();
    //             $log.next(getClassName(node.class) + ' Initialized');
    //             initialized.push(key);
    //         }
    //     });

    //     hasDependencies.forEach((node) => {
    //         const depsInitialized = node.dependencies.every((dep) => {
    //             return initialized.includes(dep);
    //         });

    //         // One issue where having here is that if
    //         // serviceA --> serviceB
    //         // serviceB --> has deps
    //         // serviceA cannot be initialized before serviceB. Ugh.
    //         // I think we need an actual dependency tree that just lists
    //         // the names of dependencies that we climb down to initialize the app.
    //         if (depsInitialized) {
    //             const args = node.dependencies.map(
    //                 (depName) => InjectableCatalog.get(depName)?.instance
    //             );
    //             node.instance = new node.class(...args);
    //             $log.next(getClassName(node.class) + ' Initialized');
    //             initialized.push(getClassName(node.class));
    //         } else {
    //             throw new Error(
    //                 'Failed to initialize dependency for ' +
    //                     getClassName(node.class)
    //             );
    //         }
    //     });
    // }

    private _createExpressServer() {
        return new Observable<string>((observer) => {
            const callback = () => {
                observer.next(
                    'Resonance is listening on port ' + this._config.port
                );
                observer.complete();
            };

            this._server =
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
        });
    }

    public exit() {
        return new Observable<string>((observer) => {
            if (this._server)
                this._server.close((err) => {
                    if (err) {
                        observer.error(err);
                    } else {
                        this._server?.closeAllConnections();
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
