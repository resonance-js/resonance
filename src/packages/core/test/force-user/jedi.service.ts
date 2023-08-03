import { Jedi } from './force-user.interface';
import { ForceService } from './force.service';
import { WeaponsService } from '../weapons/weapons.service';
import { Injectable } from '../../di/decorators/injectable.decorator';

@Injectable()
export class JediService {
    private _jedi: Jedi[] = [];

    constructor(
        private _forceService: ForceService,
        private _weaponsService: WeaponsService
    ) {
        console.log(this._forceService.abilities);
        console.log(this._weaponsService.civilized);
    }

    public addJedi(
        name: string,
        height: string,
        age: number,
        saberColor: 'blue' | 'green' | 'purple' | 'white',
        dualWield?: boolean,
        dualBlade?: boolean
    ) {
        this._jedi.push({
            name,
            height,
            age,
            saber: this._weaponsService.newWeaponForAMoreCivilizedAge(
                saberColor,
                dualWield,
                dualBlade
            ),
            powers: this._forceService.abilities,
        });
    }

    public removeJedi(name: string) {
        const index = this._jedi.findIndex((jedi) => jedi.name === name);

        if (index !== undefined) {
            this._jedi.splice(index, 1);
        }
    }

    public order66() {
        this._jedi.length = 0;
    }
}
