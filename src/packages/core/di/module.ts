import { getInjectedClassName, getInjectedProvidedIn } from './injectable';
import { getMetadata, setMetadata } from '../util/reflect';
import { Class } from '../interface/class';
import { RouteMetadataKey, RouteNameMetadataKey } from './route';
import { getClassName, getInjectedDeps } from './util/reflect';
import { DependencyTree, InjectableNode, RoutesNode } from './interface';
import { InjectableCatalog, ModuleCatalog } from './catalogs';
import { onBootstrap } from '../app/resonance-app';

export const ModuleMetadataKey = 'resonance:module';
export const ModuleBaseUrlKey = 'resonance:baseurl';

export class Module {
    private _unresolved: string[] = [];
    private _imports: Module[] = [];

    /// Let's do a final check if there are any unresolved modules
    /// and initialize them if they are or throw an error.
    finalCheck = onBootstrap.asObservable().subscribe({
        next: () => {
            console.log('bootstrapped');
        }
    });

    constructor(
        public instance: Class,
        public declarations?: DependencyTree,
        public imports?: string[],
        public exports?: DependencyTree,
        public routes?: DependencyTree,
        public baseURL?: string
    ) {
        if (imports) {
            imports.forEach((imprt) => {
                const _imprt = ModuleCatalog.get(imprt);
                if (_imprt) {
                    this._imports.push(_imprt);
                } else {
                    this._unresolved.push(imprt);
                }
            });
        }
    }
}

export interface NcModule {
    routes?: Array<Class>;
    declarations?: Array<Class>;
    exports?: Array<Class>;
    imports?: Array<Class>;
    baseURL?: string;
}

export const NcModule = (module: NcModule) => {
    return function (instance: Class) {
        const moduleName = getClassName(instance);

        setMetadata(ModuleMetadataKey, moduleName, instance);
        setMetadata(ModuleBaseUrlKey, module.baseURL, instance);

        const injectableTree = buildInjectableTree(
            moduleName,
            module.declarations,
            module.exports
        );

        ModuleCatalog.set(
            moduleName,
            new Module(
                instance,
                injectableTree.declarationsTree,
                buildImportsTree(module.imports),
                injectableTree.exportsTree,
                buildRoutesTree(module.routes),
                module.baseURL
            )
        );
    };
};

export const buildInjectableTree = (
    moduleName: string,
    declarations?: Class[],
    exprts?: Class[]
) => {
    const declarationsTree: Record<string, InjectableNode> = {};
    const exportsTree: Record<string, InjectableNode> = {};

    const exported = (exprts ?? []).map((exprt) => getInjectedClassName(exprt));
    (declarations ?? []).forEach((instance) => {
        const node: InjectableNode = {
            class: instance,
            moduleName,
            dependencies: getInjectedDeps(instance),
            providedIn: getInjectedProvidedIn(instance)
        };

        const injectableName = getInjectedClassName(instance);
        InjectableCatalog.set(injectableName, node);
        exported.includes(injectableName)
            ? (exportsTree[injectableName] = node)
            : (declarationsTree[injectableName] = node);
    });
    return {
        exportsTree,
        declarationsTree
    };
};

export const buildRoutesTree = (routes?: Class[]) => {
    const routeTree: Record<string, RoutesNode> = {};
    (routes ?? []).forEach((route) => {
        routeTree[getMetadata(RouteNameMetadataKey, route)] = {
            class: route,
            dependencies: getInjectedDeps(route),
            route: getMetadata(RouteMetadataKey, route)
        };
    });
    return routeTree;
};

export const buildImportsTree = (imports?: Class[]) => {
    const importsTree: string[] = [];

    (imports ?? []).forEach((instance) => {
        importsTree.push(getMetadata(ModuleMetadataKey, instance));
    });

    return importsTree;
};
