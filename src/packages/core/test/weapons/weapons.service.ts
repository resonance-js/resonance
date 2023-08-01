import { Injectable } from '../../di/decorators/injectable.decorator';
import { Lightsaber, Blaster, Weapon } from './weapons.interface';

@Injectable()
export class WeaponsService {
    public civilized: Lightsaber[] = [];
    public soUncivilized: Blaster[] = [];

    constructor() {}

    public newWeaponForAMoreCivilizedAge(
        color: 'blue' | 'green' | 'purple' | 'white' | 'red',
        dualBlade?: boolean,
        dualWield?: boolean
    ): Lightsaber {
        return {
            color,
            dualBlade: dualBlade ?? false,
            dualWield: dualWield ?? false,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        };
    }

    public newSoUncivilizedWeapon(name: string, functions: string[]): Weapon {
        return {
            name,
            functions,
        };
    }
}
