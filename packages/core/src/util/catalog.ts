import { Subject } from 'rxjs';
import { isNonNullable, nullable } from '../../../cxjs';

export class Catalog<K, V> extends Map<K, V> {
    public onChange = new Subject<V>();

    constructor() {
        super();
    }

    override set(key: K, value: V) {
        super.set(key, value);
        this.onChange.next(value);
        return this;
    }

    public setIfNonNullable(key: K, value: V | nullable) {
        if (isNonNullable(value)) this.set(key, value);
        return this;
    }

    public getIfNonNullableKey(key: K | nullable) {
        let val: V | undefined;
        if (isNonNullable(key)) val = this.get(key);
        if (isNonNullable(val)) return val;
        return null;
    }

    public getThen(key: K | nullable, callback?: (val: V) => void): void;

    public getThen<T>(key: K | nullable, callback: (val: V) => T): T | null;

    public getThen(key: K | nullable, callback?: (val: V) => unknown) {
        if (isNonNullable(key)) {
            const val = super.get(key);

            if (callback && isNonNullable(val)) {
                return callback(val);
            } else {
                return super.get(key);
            }
        }

        return null;
    }

    public get keysArr() {
        return Array.from(super.keys());
    }

    public get valuesArr() {
        return Array.from(super.values());
    }
}
