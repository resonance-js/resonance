import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { Injectable } from './injectable';

class _ServiceCatalog extends Map<string, Service> {
    public onChange = new Subject<Service>();
    override set(key: string, injectable: Service) {
        super.set(key, injectable);
        this.onChange.next(injectable);
        return this;
    }
}

export const ServiceCatalog = new _ServiceCatalog();

export class Service extends Injectable {
    constructor(klass: Class, name: string) {
        super(klass, name, 'Service');
        this.init();
    }

    protected override _loadDependencyFromCatalog(
        dependencyName: string,
        index: number
    ): Injectable {
        const dependency = ServiceCatalog.get(dependencyName);

        if (!dependency) {
            throw new Error(
                `Failed to initialize dependency ${dependencyName} for ${this.injectableType} ${this.name} at index ${index}.`
            );
        }

        return dependency;
    }
}
