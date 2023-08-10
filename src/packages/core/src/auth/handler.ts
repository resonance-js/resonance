import { Request } from 'express';
import { RouteCatalog } from '../di/route';
import { concatMap, throwError } from 'rxjs';
import { toObservable } from '../util/to-observable';
import { AuthLifecycleFns } from './auth_lifecycle';

export abstract class AuthHandler {
    constructor(
        public lifecycleFunction: AuthLifecycleFns[keyof AuthLifecycleFns],
        public routeName: string
    ) {}

    public onRequest(req: Request) {
        return toObservable<any>(this.parseAuth(req)).pipe(
            concatMap((parsedAuth) =>
                toObservable(this._callLifecycleFn(parsedAuth))
            )
        );
    }

    public abstract parseAuth(req: Request): any;

    private _callLifecycleFn(val: any) {
        const route = RouteCatalog.get(this.routeName);
        if (
            route &&
            route.instance &&
            (route.instance as any)[this.lifecycleFunction]
        ) {
            return (route.instance as any)[this.lifecycleFunction](val);
        } else {
            return throwError(
                () =>
                    'Route ' +
                    this.routeName +
                    ' implemented an authentication lifecycle handler but was never initialized.'
            );
        }
    }
}
