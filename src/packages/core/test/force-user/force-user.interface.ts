import { isNonNullObject } from '../../type/is-object';
import { Lightsaber, isLightsaber } from '../weapons/weapons.interface';

export interface ForceUser {
    name: string;
    height: string;
    age: number;
    saber: Lightsaber;
    powers: string[];
}

export interface Jedi extends ForceUser {}

export function isJedi(val: unknown): val is Jedi {
    return (
        isNonNullObject(val) &&
        'name' in val &&
        'saber' in val &&
        isLightsaber(val.saber) &&
        val.saber.color !== 'red'
    );
}

export interface Sith extends ForceUser {}

export function isSith(val: unknown): val is Sith {
    return (
        isNonNullObject(val) &&
        'name' in val &&
        'saber' in val &&
        isLightsaber(val.saber) &&
        val.saber.color === 'red'
    );
}
