import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { InjectableNode } from './interface';
import { Module } from './module';

export class Catalog<T> extends Map<string, T> {}

export class _InjectableCatalog extends Map<string, InjectableNode> {
    private _unresolved: string[] = [];

    override set(key: string, injectable: InjectableNode) {
        super.set(key, injectable);

        return this;
    }
}
export const InjectableCatalog = new _InjectableCatalog();

export class _ModuleCatalog extends Map<string, Module> {
    private unresolved: string[] = [];
    private imports: Module[] = [];

    override set(key: string, module: Module) {
        super.set(key, module);

        (module.imports ?? []).forEach((module) => {
            if (this.has(module)) {
            }
        });

        return this;
    }
}
export const ModuleCatalog = new _ModuleCatalog();

export const RoutesCatalog = new Catalog();

export const RootInjectableStore = new Catalog();

// We need to get this working
export const GetEndpointsCatalog = new Catalog<{
    function: any;
    endpont: string;
}>();
