export const Class = Function;

export interface Class<T> extends Function {
    prototype: T & { [classMember: string]: any };
    new (...args: any[]): any;
}

export function isClass(val: any): val is Class<any> {
    return isNonNullable(val) && typeof val === 'function';
}

/**
 * Returns a writable type version of type.
 *
 * USAGE:
 * Given:
 * ```
 * interface Person {readonly name: string}
 * ```
 *
 * We would like to get a read/write version of `Person`.
 * ```
 * const WritablePerson = Writable<Person>;
 * ```
 *
 * The result is that you can do:
 *
 * ```
 * const readonlyPerson: Person = {name: 'Marry'};
 * readonlyPerson.name = 'John'; // TypeError
 * (readonlyPerson as WritablePerson).name = 'John'; // OK
 *
 * // Error: Correctly detects that `Person` did not have `age` property.
 * (readonlyPerson as WritablePerson).age = 30;
 * ```
 *
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};
