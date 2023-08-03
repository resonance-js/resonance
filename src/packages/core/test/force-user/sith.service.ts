import { DarksideService } from './dark-side.service';
import { Sith, Jedi, isSith, isJedi } from './force-user.interface';
import { ForceService } from './force.service';
import { WeaponsService } from '../weapons/weapons.service';
import { Injectable } from '../../di/decorators/injectable.decorator';

@Injectable()
export class SithService {
    public master?: Sith;
    public apprentance?: Sith;

    constructor(
        private _forceService: ForceService,
        private _darkSideService: DarksideService,
        private _weaponsService: WeaponsService
    ) {}

    public overthrowMaster() {
        delete this.master;

        if (this.apprentance) {
            this.master = JSON.parse(JSON.stringify(this.apprentance));
        } else {
            console.log('We have brought balance to the Force.');
        }
    }

    public replaceApprentace(apprentance: Sith | Jedi) {
        delete this.apprentance;

        if (isSith(apprentance)) {
            this.apprentance = apprentance;
        }

        if (isJedi(apprentance)) {
            this.apprentance = {
                age: apprentance.age,
                height: apprentance.height,
                name: 'Darth ' + apprentance.name,
                powers: [
                    ...this._forceService.abilities,
                    ...this._darkSideService.abilities,
                ],
                saber: this._weaponsService.newWeaponForAMoreCivilizedAge(
                    'red',
                    true,
                    true
                ),
            };
        }
    }
}