import { BehaviorSubject, Observable, filter } from 'rxjs';
import { isNotNull } from '../type/not-null';

/**
 * An extension of BehaviorSubject for reactive design patterns.
 * Differs from a typical BehaviorSubject in that it...
 * - Can be instantiated without an initial value
 * - Is piped into the class member `onNext$`, which filters out null values
 * emitted by `next`.
 *
 * @example
 * *Typescript*
 * ````
 * public $foo = new ReactiveSubject<string>();
 * ...
 * public baz(qix: string) {
 *     foo.next(qix);
 * }
 * ````
 * *HTML*
 * ````
 * <div>{{ foo.onNext$ | async }}</div>
 * ````
 * @example
 * *Typescript*
 * ````
 * public $foo = new ReactiveSubject<boolean>();
 * public foo$ = this.$foo.onNext$.pipe(
 *      map((qix) => {
 *          if (qix) {
 *              return 'Hello World';
 *          } else {
 *              return 'Goodbye World';
 *          }
 *      })
 * )
 * ````
 * *HTML*
 * ````
 * <div>{{ foo$ | async }}</div>
 * ````
 */
export class ReactiveSubject<T> extends BehaviorSubject<T | null> {
    /**
     * Used in combination with the Angular async pipe to emit
     * new values to the template.
     *
     */
    public next$!: Observable<T>;

    /**
     * A cached value that might be needed for later reference.
     * @example You are setting the height of an element and want
     * to sometimes reference a constant value.
     */
    public cacheValue?: T;

    constructor(valueOrPipe?: T) {
        super(valueOrPipe ?? null);
        this.next$ = this.pipe(filter(isNotNull));
    }

    /**
     * The last emitted value from {@link next}.
     */
    public get currentValue() {
        return this['_value'] as T;
    }

    public setCacheValue(value: T) {
        this.cacheValue = value;
    }
}
