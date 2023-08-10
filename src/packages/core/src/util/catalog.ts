import { Subject } from 'rxjs';
import { isNonNullable } from '../../../cxjs';

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

    public setIfNonNullable(key: K, value: V | null | undefined) {
        if (isNonNullable(value)) this.set(key, value);
        return this;
    }

    public getThen(key: K, callback: (val: V) => void) {
        const val = this.get(key);
        if (val) {
            callback(val);
        }
    }

    public get keysArr() {
        return Array.from(super.keys());
    }

    public get valuesArr() {
        return Array.from(super.values());
    }
}
