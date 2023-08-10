import { Subject, concatMap, forkJoin, map, of, take } from 'rxjs';
import { Class } from '../interface/class';
import { Injectable, InjectableCatalog } from './injectable';
import { Route, RouteCatalog } from './route';
import { Catalog, ReactiveSubject } from '../util';
import { getClassName } from '../util/reflect';
import { NcModule, module_ref as module_ref } from './module.decorator';
import { injectable_ref } from './injectable.decorator';
import { route_ref } from './route.decorator';

class _ModuleCatalog extends Map<string, Module> {
    public onSet = new Subject<{
        moduleName: string;
        instance: Module;
    }>();

    override set(key: string, module: Module) {
        super.set(key, module);
        this.onSet.next({
            moduleName: key,
            instance: module,
        });
        return this;
    }
}

export const ModuleCatalog = new _ModuleCatalog();

export class Module {
    public name: string;
    public instance: Class<any>;

    public declarations = new Catalog<string, Injectable>();
    public exports = new Catalog<string, Injectable>();
    public imports = new Catalog<string, Module>();

    public baseURL: string | undefined;
    public routes = new Catalog<string, Route>();

    public $onInit = new ReactiveSubject<boolean>();
    public onInit$ = this.$onInit.next$.pipe(take(1));

    constructor(
        public reference: Class<module_ref>,
        ncModule: NcModule
    ) {
        this.name = getClassName(reference);
        this.baseURL = ncModule.baseURL;
        this.instance = new reference();
        this.imports = this._loadImports(ncModule.imports);

        this._initializeDeclarations(
            ncModule.declarations,
            Object.values(ncModule.exports ?? []).map(
                (exprt) => exprt.prototype.name
            )
        )
            .pipe(concatMap(() => this._initializeRoutes(ncModule.routes)))
            .subscribe(() => {
                this.$onInit.next(true);
            });
    }

    private _loadImports(imports: Class<module_ref>[] = []) {
        const toReturn = new Catalog<string, Module>();
        imports.forEach((imprt) => {
            const moduleName = getClassName(imprt);
            const module = ModuleCatalog.get(moduleName);
            toReturn.setIfNonNullable(moduleName, module);
        });
        return toReturn;
    }

    private _initializeDeclarations(
        declarations: Class<injectable_ref>[] = [],
        exports: string[] = []
    ) {
        if (declarations.length === 0)
            return of('No declarations to initialize');

        return forkJoin(
            declarations.map((injectableRef, index) => {
                const injectableName = injectableRef.prototype.name;
                const injectable = InjectableCatalog.get(injectableName);

                if (injectable === undefined) {
                    throw new Error(
                        `Failed to initialize declaration ${injectableName} for module ${this.name} at index ${index}. ` +
                            `Did you decorate ${injectableName} with @Injectable()?`
                    );
                }

                return injectable.onInit$.pipe(
                    map(() => {
                        exports.includes(injectableName)
                            ? this.exports.set(injectableName, injectable)
                            : this.declarations.set(injectableName, injectable);
                        return 'Declaration initialized';
                    })
                );
            })
        ).pipe(map(() => 'Declarations initialized'));
    }

    private _initializeRoutes(routes: Class<route_ref>[] = []) {
        if (routes.length === 0) return of('No routes to initialize.');

        return forkJoin(
            routes.map((routeRef, index) => {
                const routeName = routeRef.prototype.name;
                const route = RouteCatalog.get(routeName);

                if (route === undefined) {
                    throw new Error(
                        `Failed to initialize route ${routeName} for module ${this.name} at index ${index}. ` +
                            `Did you decorate ${routeName} with @Route()?`
                    );
                }

                return route.onInit$.pipe(
                    map(() => {
                        this.routes.set(routeName, route);
                    })
                );
            })
        );
    }
}
