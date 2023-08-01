import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { NcModule } from './decorators/module.decorator';
import { getClassName } from './util/reflect';

export class _ModuleCatalog extends Map<string, Module> {
    public onChange = new Subject<Module>();

    override set(key: string, module: Module) {
        super.set(key, module);
        this.onChange.next(module);
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
    public routes: Record<string, Class> = {};
    public declarations: Record<string, Class> = {};
    public exports: Record<string, Class> = {};
    public imports: Record<string, Module> = {};

    constructor(
        public module: Class,
        ncModule: NcModule
    ) {
        this.name = getClassName(module);
        this.baseURL = ncModule.baseURL;
        this.instance = new module();

        // const accessibleServices = [];

        ncModule.imports?.forEach((importedModule) => {
            const moduleName = getClassName(importedModule);
            const reference = ModuleCatalog.get(moduleName);
            if (ModuleCatalog.has(moduleName) && reference) {
                this.imports[moduleName] = reference;
            } else {
                throw new Error('Unresolved modules');
            }
        });

        // ncModule.declarations?.forEach((service) => {
        //     const dependencies = getInjectedDeps(service);
        //     const providedIn = getInjectedProvidedIn(service);
        //     const serviceName = getClassName(service);
        // });
    }
}
