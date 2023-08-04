import { Subject, concatMap, forkJoin, map, take } from 'rxjs';
import { Class } from '../interface/class';
import { NcModule } from './decorators/module.decorator';
import { getClassName } from './util/reflect';
import { Service, ServiceCatalog } from './service';
import { Route, RouteCatalog } from './route';
import { ReactiveSubject } from '../util';

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
    public baseURL: string | undefined;
    public instance: Class;
    public routes = new Map<string, Route>();
    public declarations = new Map<string, Service>();
    public exports = new Map<string, Service>();
    public imports = new Map<string, Module>();

    public $onInit = new ReactiveSubject<boolean>();

    constructor(
        public reference: Class,
        ncModule: NcModule
    ) {
        this.name = getClassName(reference);
        this.baseURL = ncModule.baseURL;
        this.instance = new reference();
        this.imports = this._processImports(ncModule.imports);

        forkJoin(
            this._initializeDeclarations(
                ncModule.declarations,
                Object.values(ncModule.exports ?? []).map(
                    (exprt) => exprt.prototype.name
                )
            )
        )
            .pipe(
                concatMap(() =>
                    forkJoin(this._initializeRoutes(ncModule.routes))
                )
            )
            .subscribe(() => {
                this.$onInit.next(true);
            });
    }

    private _processImports(imports: Class[] = []) {
        const toReturn = new Map<string, Module>();
        imports.forEach((imprt) => {
            const moduleName = getClassName(imprt);
            const module = ModuleCatalog.get(moduleName);
            if (module) {
                toReturn.set(moduleName, module);
            }
        });
        return toReturn;
    }

    private _initializeDeclarations(
        declarations: Class[] = [],
        exports: string[] = []
    ) {
        return declarations.map((serviceReference, index) => {
            const serviceName = serviceReference.prototype.name;
            const service = ServiceCatalog.get(serviceName);

            if (service === undefined) {
                throw new Error(
                    `Failed to initialize declaration ${serviceName} for module ${this.name} at index ${index}. ` +
                        `Did you decorate ${serviceName} with @Service()?`
                );
            }

            return service.$onInit.next$.pipe(
                take(1),
                map(() =>
                    exports.includes(serviceName)
                        ? this.exports.set(serviceName, service)
                        : this.declarations.set(serviceName, service)
                )
            );
        });
    }

    private _initializeRoutes(routes: Class[] = []) {
        return routes.map((routeReference, index) => {
            const routeName = routeReference.prototype.name;
            const route = RouteCatalog.get(routeName);

            if (route === undefined) {
                throw new Error(
                    `Failed to initialize route ${routeName} for module ${this.name} at index ${index}. ` +
                        `Did you decorate ${routeName} with @Route()?`
                );
            }

            return route.$onInit.next$.pipe(
                take(1),
                map(() => this.routes.set(routeName, route))
            );
        });
    }
}
