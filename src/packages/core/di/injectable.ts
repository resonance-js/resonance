import { forkJoin, map, of, take } from 'rxjs';
import { Class } from '../interface/class';
import { ReactiveSubject } from '../util';

export abstract class Injectable {
    public dependencies: Injectable[] = [];
    public instance?: Class;

    public $onInit = new ReactiveSubject<boolean>();

    constructor(
        public klass: Class,
        public name: string,
        public injectableType: string
    ) {}

    public init() {
        this.dependencies = (this.klass.prototype.injected as string[]).map(
            (dependencyName, index) =>
                this._loadDependencyFromCatalog(dependencyName, index)
        );

        this._injectDependencies().subscribe(() => this.$onInit.next(true));
    }

    protected abstract _loadDependencyFromCatalog(
        dependencyName: string,
        index: number
    ): Injectable;

    private _injectDependencies() {
        if (this.dependencies.length === 0) {
            this.instance = new this.klass();
            return of(true);
        }

        return forkJoin(
            this.dependencies.map((dep) => dep.$onInit.next$.pipe(take(1)))
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

                this.instance = new this.klass(...args);
                return true;
            })
        );
    }
}
