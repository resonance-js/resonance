import { Get } from '@nestjs/common';
import { of } from 'rxjs';
import { Route } from '@resonance/core';
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
