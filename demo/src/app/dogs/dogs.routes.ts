import { Get, Param, Route } from '@resonance/core';
import { DogService } from './dogs.service';

@Route('dogs')
export class DogRoutes {
    constructor(private _dogsService: DogService) {}

    @Get()
    public getAllDogs() {
        return this._dogsService.getAllDogs();
    }

    @Get(':id')
    public getDogByID(
        @Param('id', {
            type: 'number',
        })
        id: number
    ) {
        console.log(id);
        return this._dogsService.getDogByID(id);
    }
}
