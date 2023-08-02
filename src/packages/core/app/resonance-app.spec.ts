import { map, of } from 'rxjs';
import { Injectable } from '../di/decorators/injectable.decorator';
import { NcModule } from '../di/decorators/module.decorator';
import { Route } from '../di/decorators/route.decorator';
import { Get } from '../http/decorators/get.decorator';
import { As } from '../../cxjs';
import { HttpResponse } from '../http/interface/http-response';
import { $bootstrapped } from './lifecycle';
import { Resonance } from './resonance-app';

interface Breed {
    name: string;
    primaryColor: string;
    secondaryColor?: string;
    coat: 'fur' | 'hair';
    averageHeight?: number;
    averageWeight?: number;
}

@Injectable()
class BreedsService {
    public breeds: Breed[] = [
        {
            name: 'German Shepheard',
            primaryColor: 'brown',
            secondaryColor: 'black',
            coat: 'hair',
        },
        {
            name: 'Bulldog',
            primaryColor: 'white',
            secondaryColor: 'brown',
            coat: 'hair',
        },
        {
            name: 'Golden Retreiver',
            primaryColor: 'yellow',
            coat: 'fur',
        },
        {
            name: 'Siberian Husky',
            primaryColor: 'black',
            secondaryColor: 'white',
            coat: 'fur',
        },
    ];

    constructor() {}

    addBreed(breed: Breed) {
        this.breeds.push(breed);
    }

    removeBreed(name: string) {
        this.breeds.splice(
            this.breeds.findIndex((breed) => breed.name === name),
            1
        );
    }

    getBreed(name: string) {
        of(this.breeds.find((breed) => breed.name === name)).pipe(
            map((breed) => {
                if (breed === undefined) {
                    throw As<HttpResponse>({
                        status: 404,
                        message: 'Breed with name ' + name + ' not found.',
                    });
                }

                breed;
            })
        );
    }
}

@Route('breed')
class BreedsRoute {
    constructor(private _breedsService: BreedsService) {
        this._breedsService.addBreed({
            name: 'chihuahua',
            coat: 'hair',
            primaryColor: 'brown',
            secondaryColor: 'white',
        });
    }

    @Get()
    public getAllBreeds() {
        return this._breedsService.breeds;
    }

    @Get(':name')
    public getBreed(name: string) {
        this._breedsService.getBreed(name);
    }

    @Get(':colors')
    public getBreedColors() {
        return of(
            this._breedsService.breeds.map((breed) => breed.primaryColor)
        );
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
