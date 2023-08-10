import { isNonNullable } from '../../../cxjs';

export interface AuthLifecycleFns {
    basicAuth: 'ncOnBasicAuthRequest';
    bearerToken: 'ncOnBearerTokenRequest';
}

export const AuthLifecycleFnNames: AuthLifecycleFns = {
    basicAuth: 'ncOnBasicAuthRequest',
    bearerToken: 'ncOnBearerTokenRequest',
};

export interface OnBasicAuthRequest<T> {
    ncOnBasicAuthRequest(credentials: {
        username: string;
        password: string;
    }): T;
}

export function implementsBasicAuth<T = any>(
    prototype: any,
    instance: any
): prototype is OnBasicAuthRequest<T> {
    return (
        isNonNullable(instance) &&
        isNonNullable(prototype) &&
        Reflect.ownKeys(prototype).includes(AuthLifecycleFnNames.bearerToken)
    );
}

export interface OnBearerTokenRequest<T> {
    ncOnBearerTokenRequest(credentials: {
        username: string;
        password: string;
    }): T;
}

export function implementsBearerAuth<T = any>(
    prototype: any,
    instance: any
): prototype is OnBasicAuthRequest<T> {
    return (
        isNonNullable(instance) &&
        isNonNullable(prototype) &&
        Reflect.ownKeys(prototype).includes(AuthLifecycleFnNames.basicAuth)
    );
}
