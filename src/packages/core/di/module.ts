import { Subject, firstValueFrom, forkJoin, of } from 'rxjs';
import { Class } from '../interface/class';
import { NcModule } from './decorators/module.decorator';
import { getClassName } from './util/reflect';
import { Service, ServiceCatalog } from './injectable';
import { Route, RouteCatalog } from './route';

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

    constructor(
        public module: Class,
        ncModule: NcModule
    ) {
        this.name = getClassName(module);
        this.baseURL = ncModule.baseURL;
        this.instance = new module();
        this.imports = this._processImports(ncModule.imports);

        this._initializeDeclarations(
            ncModule.declarations,
            Object.values(ncModule.exports ?? []).map(
                (exprt) => exprt.prototype.name
            )
        );
        this._initializeRoutes(ncModule.routes);
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
        declarations.forEach(async (serviceKlass, index) => {
            const serviceName = serviceKlass.prototype.name;
            const service = ServiceCatalog.get(serviceKlass.prototype.name);

            if (service === undefined) {
                throw new Error(
                    `Failed to initialize dependency for ${serviceName} at index ${index}.`
                );
            }

            if (service.dependencies.length === 0) {
                service.initializeInstance();
            } else {
                await firstValueFrom(
                    forkJoin(
                        service.dependencies.map((dep) =>
                            dep.instance ? of(true) : dep.$onInitialized
                        )
                    )
                );

                const args = service.dependencies.map(
                    (service) => service.instance
                );

                if (args.includes(undefined)) {
                    throw new Error(
                        `Failed to resolve dependency for ${serviceName} at index ${args.indexOf(
                            undefined
                        )}`
                    );
                }

                service.initializeInstance(...args);
            }

            if (exports.includes(serviceName)) {
                this.exports.set(serviceName, service);
            } else {
                this.declarations.set(serviceName, service);
            }
        });
    }

    private _initializeRoutes(routes: Class[] = []) {
        routes.forEach(async (routeKlass, index) => {
            const routeName = routeKlass.prototype.name;
            const route = RouteCatalog.get(routeKlass.prototype.name);

            if (route === undefined) {
                throw new Error(
                    `Failed to initialize dependency for ${routeName} at index ${index}.`
                );
            }

            if (route.dependencies.length === 0) {
                route.initializeInstance();
            } else {
                await firstValueFrom(
                    forkJoin(
                        route.dependencies.map((dep) =>
                            dep.instance ? of(true) : dep.$onInitialized
                        )
                    )
                );

                const args = route.dependencies.map(
                    (service) => service.instance
                );

                if (args.includes(undefined)) {
                    throw new Error(
                        `Failed to resolve dependency for ${routeName} at index ${args.indexOf(
                            undefined
                        )}`
                    );
                }

                route.initializeInstance(...args);
            }

            this.routes.set(routeName, route);
        });
    }
}
