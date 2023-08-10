import {
    Observable,
    isObservable as _isObservable,
    of,
    throwError,
} from 'rxjs';
import { isNonNullable } from '../../../cxjs';

export function isObservable<T>(val: unknown): val is Observable<T> {
    return isNonNullable(val) && isObservable(val);
}

export function toObservable<T>(val: any): Observable<T> {
    if (isObservable<T>(val)) return val;
    if (isNonNullable(val)) return of(val);
    return throwError(
        () => 'Failed to return observable, as val is null or undefined.'
    );
}
