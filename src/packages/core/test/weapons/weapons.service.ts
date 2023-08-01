import { Injectable } from '../../di/decorators/injectable.decorator';
import { Lightsaber, Weapon } from './weapons.interface';

@Injectable()
export class WeaponsService {
    public civilized: Lightsaber[] = [
        {
            color: 'blue',
            dualBlade: false,
            dualWield: false,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        },
        {
            color: 'green',
            dualBlade: false,
            dualWield: false,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        },
        {
            color: 'purple',
            dualBlade: false,
            dualWield: false,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        },
        {
            color: 'white',
            dualBlade: false,
            dualWield: true,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        },
        {
            color: 'red',
            dualBlade: true,
            dualWield: false,
            functions: ['slice', 'stab', 'block', 'cauterize'],
            name: 'lightsaber',
        },
    ];
    public soUncivilized: Weapon[] = [
        {
            functions: ['shoot'],
            name: 'Blaster',
        },
    ];

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
