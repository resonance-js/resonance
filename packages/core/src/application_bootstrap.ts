import { Class } from './interface/class';
import { $bootstrapped, $routesInitialized } from './application_lifecycle';
import { getClassName } from './util';
import { NcModuleRef, ModuleCatalog } from './di/module';
import { module_ref } from './di';

export class Resonance {
    public appRef!: NcModuleRef;

    constructor() {}

    boostrap(rootAppModule: Class<module_ref>) {
        this._initializeRootModule(rootAppModule);
        $bootstrapped.next(true);
        $bootstrapped.complete();

        $routesInitialized.next(true);
        $routesInitialized.complete();
        return this;
    }

    private _initializeRootModule(appModule: Class<module_ref>) {
        const rootModuleName = getClassName(appModule);

        const appRef = ModuleCatalog.get(rootModuleName);

        if (appRef === undefined) {
            throw new Error(
                `Failed to initialize Resonance app root module ${rootModuleName}. Are you sure you provided the root module  bootstrap?`
            );
        }

        this.appRef = appRef;
    }
}
