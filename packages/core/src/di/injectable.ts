import { take, of, forkJoin, map } from 'rxjs';
import { Class } from '../interface/class';
import { Catalog, ReactiveSubject } from '../util';
import { injectable_ref } from './injectable.decorator';

export const InjectableCatalog = new Catalog<
    string,
    InjectableRef<injectable_ref>
>();

export interface _injectable_ref {
    name: string;
    injected: string[];
}

export class InjectableRef<T extends _injectable_ref> {
    /**
     * Other `@Injectables` injected into the constructor of {@link reference}.
     */
    public dependencies: InjectableRef<injectable_ref>[] = [];

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
        public injectableType = 'Injectable'
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
