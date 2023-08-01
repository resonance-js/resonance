import { Subject, forkJoin, of } from 'rxjs';
import { Class } from '../interface/class';
import { NcModule } from './decorators/module.decorator';
import { getClassName } from './util/reflect';
import { Service, ServiceCatalog } from './injectable';

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

export interface ServiceImport {
    serviceName: string;
    service: Class;
    providedIn: 'root' | 'module' | null;
    dependencies: string[];
}

export class Module {
    public name: string;
    public baseURL: string | undefined;
    public instance: Class;
    public routes = new Map<string, Class>();
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
        declarations.forEach((serviceKlass, index) => {
            const serviceName = serviceKlass.prototype.name;
            const service = ServiceCatalog.get(serviceKlass.prototype.name);

            if (service === undefined) {
                throw new Error(
                    `Failed to initialize dependency for ${serviceName} at index ${index}.`
                );
            }

            if (service.dependencies.length === 0) {
                service.initializeInstance();

                if (exports.includes(serviceName)) {
                    this.exports.set(serviceName, service);
                } else {
                    this.declarations.set(serviceName, service);
                }
            } else {
                forkJoin(
                    service.dependencies.map((dep) =>
                        dep.instance ? of(true) : dep.$onInitialized
                    )
                ).subscribe(() => {
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
                });
            }
        });
    }

    // private _initializeDeclarationWithDeps(
    //     serviceImports: string[],
    //     serviceName: string,
    //     declaredService: Service
    // ) {
    //     const args: (Class | null)[] = [];
    //     const onInjected: Observable<{
    //         index: number;
    //         injectedService: Service;
    //     }>[] = [];

    //     serviceImports.map((injectedServiceName, index) => {
    //         const injectedService = ServiceCatalog.get(injectedServiceName);

    //         if (injectedService === undefined) {
    //             throw new Error(
    //                 `Failed to initialize dependency for ${serviceName} at index ${index}.`
    //             );
    //         }

    //         if (!injectedService.instance) {
    //             args[index] = null;
    //             onInjected.push(
    //                 injectedService.$onInitialized.pipe(
    //                     map(() => ({
    //                         index,
    //                         injectedService,
    //                     }))
    //                 )
    //             );
    //         } else {
    //             args[index] = injectedService.instance;
    //         }
    //     });

    //     if (onInjected.length === 0) {
    //         declaredService.initializeInstance(...args);
    //         this.declarations.set(serviceName, declaredService);
    //     }
    // else {
    //     forkJoin(onInjected)
    //         .pipe(concatMap((val) => of(...val)))
    //         .subscribe((dep) => {
    //             if (dep.injectedService.instance) {
    //                 args[dep.index] = dep.injectedService.instance;
    //             } else {
    //                 throw new Error(
    //                     `Failed to initialize dependency for ${serviceName} at index ${dep.index}.`
    //                 );
    //             }
    //         });
    // }
    // }
}
