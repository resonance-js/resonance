import { Subject } from 'rxjs';
import { Class } from '../interface/class';
import { injectable_ref } from './injectable.decorator';
import { of, forkJoin, take, map } from 'rxjs';
import { ReactiveSubject } from '../util';

export interface _injectable_ref {
    name: string;
    injected: string[];
}

export class _Injectable<T extends _injectable_ref> {
    /**
     * Other `@Injectables` injected into the constructor of {@link reference}.
     */
    public dependencies: Injectable[] = [];

    /**
     * The instantiated class decorated with `@Injectable`.
     */
    public instance?: Class<any>;

    /**
     * Emits to {@link onInit$} when all dependencies are resolved.
     */
    private _$onInit = new ReactiveSubject<boolean>();

    /**
     * Emits when all dependencies have been resolved.
     */
    public onInit$ = this._$onInit.next$.pipe(take(1));

    constructor(
        public reference: Class<T>,
        public name: string,
        public injectableType = 'Service'
    ) {
        this.dependencies = (this.reference.prototype.injected as string[]).map(
            (dependencyName, index) => {
                const dependency = InjectableCatalog.get(dependencyName);

                if (!dependency) {
                    throw new Error(
                        `Failed to initialize dependency ${dependencyName} for ${this.injectableType} ${this.name} at index ${index}.`
                    );
                }

                return dependency;
            }
        );
    }

    public init() {
        this._injectDependencies().subscribe(() => this._$onInit.next(true));
    }

    private _injectDependencies() {
        if (this.dependencies.length === 0) {
            this.instance = new this.reference();
            return of(true);
        }

        return forkJoin(
            this.dependencies.map((dep) => dep.onInit$.pipe(take(1)))
        ).pipe(
            map(() => {
                const args = this.dependencies.map(
                    (service) => service.instance
                );

                if (args.includes(undefined)) {
                    throw new Error(
                        `Failed to resolve dependency for ${
                            this.injectableType
                        } ${this.name}  at index ${args.indexOf(undefined)}`
                    );
                }

                this.instance = new this.reference(...args);
                return true;
            })
        );
    }
}

class _InjectableCatalog extends Map<string, Injectable> {
    public onChange = new Subject<Injectable>();
    override set(key: string, injectable: Injectable) {
        super.set(key, injectable);
        this.onChange.next(injectable);
        return this;
    }
}

export const InjectableCatalog = new _InjectableCatalog();

export class Injectable extends _Injectable<injectable_ref> {
    constructor(reference: Class<injectable_ref>) {
        super(reference, 'Injectable');
        this.init();
    }
}
