import { isNonNullable } from '@fusion-rx/ts';

export declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const isHttpMethod = (val: unknown): val is HttpMethod =>
    isNonNullable(val) &&
    typeof val === 'string' &&
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(val);
