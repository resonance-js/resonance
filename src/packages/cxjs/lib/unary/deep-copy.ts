import { UnaryFunction } from 'rxjs';

export interface DeepCopy<T> extends UnaryFunction<T, T> {}

export const DeepCopy = <T = any>(item: T): T => {
    return JSON.parse(JSON.stringify(item));
};
