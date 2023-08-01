import { Subject } from 'rxjs';
import { Class } from '../interface/class';

class _ServiceCatalog extends Map<string, Service> {
    public onChange = new Subject<Service>();
    override set(key: string, injectable: Service) {
        super.set(key, injectable);
        this.onChange.next(injectable);
        return this;
    }
}

export const ServiceCatalog = new _ServiceCatalog();

export class Service {
    public name: string;
    public providedIn: string;
    public instance?: Class;
    public dependencies: Service[] = [];

    public $onInitialized = new Subject<boolean>();

    public exported?: boolean;
    public moduleName?: string;

    constructor(public service: Class) {
        this.name = service.prototype.name;
        this.providedIn = service.prototype.providedIn ?? 'module';

        (service.prototype.injected as string[]).forEach(
            (dependencyName, index) => {
                const dependency = ServiceCatalog.get(dependencyName);

                if (!dependency) {
                    throw new Error(
                        `Failed to initialize dependency for ${this.name} at index ${index}.`
                    );
                }

                this.dependencies.push(dependency);
            }
        );
    }

    public initializeInstance(...args: any[]) {
        this.instance = new this.service(...args);
        this.$onInitialized.next(true);
        this.$onInitialized.complete();
    }
}
