import { Injectable } from '../di/decorators/injectable.decorator';
import { NcModule } from '../di/decorators/module.decorator';
import { Route } from '../di/decorators/route.decorator';
import { Get } from '../rest/decorators/get.decorator';
import { $bootstrapped, Resonance } from './resonance-app';

@Injectable()
class BreedsService {
    public breeds = [
        'German Shepheard',
        'Bulldog',
        'Golden Retreiver',
        'Siberian Husky',
    ];

    constructor() {}

    addBreed(breed: string) {
        this.breeds.push(breed);
    }

    removeBreed(breed: string) {
        this.breeds.splice(this.breeds.indexOf(breed), 1);
    }
}

@Route('breed')
class BreedsRoute {
    constructor(private _breedsService: BreedsService) {
        this._breedsService.addBreed('chihuahua');
    }

    @Get()
    public getAllBreeds() {
        return this._breedsService.breeds;
    }
}

@NcModule({
    baseURL: 'breeds',
    declarations: [BreedsService],
    exports: [BreedsService],
    routes: [BreedsRoute],
})
class BreedsModule {}

@NcModule({
    baseURL: 'api',
    imports: [BreedsModule],
})
class AppModule {}

describe('Resonance app compiler', () => {
    let app = new Resonance({
        port: 3002,
    });

    beforeAll((done) => {
        app.boostrap(AppModule).subscribe((val) => {
            expect(val.includes('Resonance is listening')).toEqual(true);
            done();
        });
    });

    test('Expect $bootstrapped to return true.', () => {
        expect($bootstrapped.value).toEqual(true);
    });

    test('Expect $serverInitialized to return true.', () => {
        expect($bootstrapped.value).toEqual(true);
    });

    afterAll((done) => {
        app.exit().subscribe((val) => {
            expect(val.startsWith('Resonance exited')).toEqual(true);
            done();
        });
    });
});
