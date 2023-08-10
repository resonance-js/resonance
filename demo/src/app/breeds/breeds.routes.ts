import { Get, Param, Route } from '@resonance/core';
import { BreedsService } from './breeds.service';

@Route('breeds')
export class BreedsRoute {
    constructor(private _breedsService: BreedsService) {}

    @Get()
    public getAllBreeds() {
        return this._breedsService.getDogBreeds();
    }

    @Get(':breed')
    public getDogsByBreed(@Param('breed') breed: string) {
        return this._breedsService.getDogsByBreed(breed);
    }
}
