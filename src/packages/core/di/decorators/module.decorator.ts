import { Subject } from 'rxjs';
import { Class } from '../../interface/class';
import { setMetadata } from '../../util/reflect';
import { getClassName, getInjectedDeps } from '../util/reflect';

export const ModuleMetadataKey = 'resonance:module';
export const ModuleBaseUrlKey = 'resonance:baseurl';

export interface NcModule {
    routes?: Array<Class>;
    declarations?: Array<Class>;
    exports?: Array<Class>;
    imports?: Array<Class>;
    baseURL?: string;
}

class ModuleCatalog extends Map<string, Class> {
    public onSet = new Subject<{
        moduleName: string;
        instance: Class;
    }>();
    override set(key: string, module: Class) {
        super.set(key, module);
        this.onSet.next({
            moduleName: key,
            instance: module,
        });
        return this;
    }
}
const moduleCatalog = new ModuleCatalog();

/**
 * Module decorator and metadata.
 */
export const NcModule = (ncModule: NcModule) => {
    return function (instance: Class) {
        const moduleName = getClassName(instance);
        setMetadata(ModuleMetadataKey, moduleName, instance);
        setMetadata(ModuleBaseUrlKey, ncModule.baseURL, instance);

        instance.prototype.name = moduleName;
        instance.prototype.declarations = [];
        instance.prototype.exports = [];
        instance.prototype.baseURL = ncModule.baseURL;

        const initializedServices: string[] = [];
        const declaredClassNames: string[] = (ncModule.declarations ?? []).map(
            (instance) => getClassName(instance)
        );

        (ncModule.declarations ?? []).forEach((declaration) => {
            const importName = getClassName(declaration);
            const importsStrings = getInjectedDeps(declaration);

            console.log(importsStrings);

            if (importsStrings.length === 0) {
                initializedServices.push(importName);
                instance.prototype.declarations.push(new declaration());
            } else if (
                importsStrings.every((importString) =>
                    declaredClassNames.includes(importString)
                )
            ) {
                // Start building dependencies.
            }
        });

        moduleCatalog.onSet.subscribe({
            next: (module) => {
                console.log(module.instance.prototype.declarations);
            },
        });

        moduleCatalog.set(moduleName, instance);

        // console.log(instance.prototype);
    };
};

// export const buildInjectableTree = (
//     moduleName: string,
//     declarations?: Class[],
//     exprts?: Class[]
// ) => {
//     const declarationsTree: Record<string, InjectableNode> = {};
//     const exportsTree: Record<string, InjectableNode> = {};

//     const exported = (exprts ?? []).map((exprt) => getInjectedClassName(exprt));
//     (declarations ?? []).forEach((instance) => {
//         const injectableName = getInjectedClassName(instance);

//         const node: InjectableNode = {
//             class: instance,
//             className: injectableName,
//             moduleName,
//             dependencies: getInjectedDeps(instance),
//             providedIn: getInjectedProvidedIn(instance),
//         };

//         InjectableCatalog.set(injectableName, node);
//         exported.includes(injectableName)
//             ? (exportsTree[injectableName] = node)
//             : (declarationsTree[injectableName] = node);
//     });
//     return {
//         exportsTree,
//         declarationsTree,
//     };
// };

// export const buildRoutesTree = (routes?: Class[]) => {
//     const routeTree: Record<string, RoutesNode> = {};
//     (routes ?? []).forEach((route) => {
//         routeTree[getMetadata(RouteNameMetadataKey, route)] = {
//             class: route,
//             dependencies: getInjectedDeps(route),
//             route: getMetadata(RouteMetadataKey, route),
//             className: getClassName(route),
//         };
//     });
//     return routeTree;
// };

// export const buildImportsTree = (imports?: Class[]) => {
//     const importsTree: string[] = [];

//     (imports ?? []).forEach((instance) => {
//         importsTree.push(getMetadata(ModuleMetadataKey, instance));
//     });

//     return importsTree;
// };
