import { UnaryFunction } from 'rxjs';

export interface DeepCopy<T> extends UnaryFunction<T, T> {}

export const deepCopy = <T = any>(item: T): T =>
    JSON.parse(JSON.stringify(item));
