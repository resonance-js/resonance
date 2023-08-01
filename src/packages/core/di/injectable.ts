import { Subject } from 'rxjs';
import { Class } from '../interface/class';

export class _ServiceCatalog extends Map<string, Service> {
    public onChange = new Subject<Service>();
    override set(key: string, injectable: Service) {
        super.set(key, injectable);
        this.onChange.next(injectable);
        return this;
    }
}

export const ServiceCatalog = new _ServiceCatalog();

export class Service {
    constructor(
        public service: Class,
        public moduleName: string,
        public providedIn?: 'root' | 'module' | null
    ) {
        this.providedIn = providedIn ?? 'module';
    }
}
