import { isNonNullObject } from '../../type/is-object';

export interface Weapon {
    name: string;
    functions: string[];
    thwarts?: Weapon[];
}

export interface Blaster extends Weapon {
    name: 'blaster';
    functions: ['shoot'];
}

export function isBlaster(val: unknown): val is Blaster {
    return isNonNullObject(val) && 'name' in val && val.name === 'blaster';
}

export interface Lightsaber extends Weapon {
    name: 'lightsaber';
    functions: ['slice', 'stab', 'block', 'cauterize'];
    color: 'blue' | 'green' | 'purple' | 'white' | 'red';
    dualBlade: boolean;
    dualWield: boolean;
}

export function isLightsaber(val: unknown): val is Lightsaber {
    return isNonNullObject(val) && 'name' in val && val.name === 'lightsaber';
}