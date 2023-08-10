import { Get, Param, Query, Route } from '@resonance/core';
import { DogService } from './dogs.service';

@Route('dogs')
export class DogRoutes {
    constructor(private _dogsService: DogService) {}

    @Get()
    public getAllDogs(
        @Query('age', false)
        age: number
    ) {
        return this._dogsService.queryDogs({
            age,
        });
    }

    @Get(':id')
    public getDogByID(
        @Param('id')
        id: number
    ) {
        return this._dogsService.getDogByID(id);
    }
}
