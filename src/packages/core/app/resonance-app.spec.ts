import { Injectable } from '../di/injectable';
import { NcModule } from '../di/module';

@Injectable()
export class LightsaberService {
    constructor() {}

    public activate() {}

    public deactivate() {}
}

@Injectable()
export class Blaster {
    constructor() {}

    public shoot() {}
}

@NcModule({
    baseURL: '',
    declarations: [LightsaberService, Blaster],
    exports: [LightsaberService, Blaster],
})
export class WeaponsModule {}

@Injectable()
export class TheForceService {
    constructor() {}

    public push() {}

    public pull() {}
}

export interface Jedi {
    name: string;
    height: string;
    age: number;
    saberColor: 'blue' | 'green' | 'purple' | 'white';
}

@Injectable()
export class JediService {
    private _jedi: Jedi[] = [];

    constructor(private _forceService: TheForceService) {}

    public addJedi(
        name: string,
        height: string,
        age: number,
        saberColor: 'blue' | 'green' | 'purple' | 'white'
    ) {
        this._jedi.push({
            name,
            height,
            age,
            saberColor,
        });
    }

    public removeJedi(name: string) {
        const index = this._jedi.findIndex((jedi) => jedi.name === name);

        if (index !== undefined) {
            this._jedi.splice(index, 1);
        }
    }
}

@Injectable()
export class SithService {
    constructor(private _forceService: TheForceService) {}
}

@NcModule({
    baseURL: 'force-user',
    declarations: [TheForceService, JediService, SithService],
    exports: [JediService, SithService],
    imports: [WeaponsModule],
})
export class ForceUserModule {}

@Injectable()
export class AppService {}

// @NcModule({
//     baseURL: 'api',
//     declarations: [AppService],

// })
describe('Resonance app compiler', () => {});
