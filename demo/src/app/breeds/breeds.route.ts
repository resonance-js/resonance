import { of } from 'rxjs';
import { Get, Route } from '@resonance/core';
import { BreedsService } from './breeds.service';

@Route('breed')
export class BreedsRoute {
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

    @Get('name/:name')
    public getBreed(name: string) {
        return this._breedsService.getBreed(name);
    }

    @Get('color')
    public getBreedColors() {
        return of(
            this._breedsService.breeds.map((breed) => breed.primaryColor)
        );
    }
}
