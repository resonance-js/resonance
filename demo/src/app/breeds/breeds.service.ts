import { Injectable } from '@resonance/core';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BreedsService {
    constructor(private _databaseService: DatabaseService) {}

    public getDogBreeds() {
        return this._databaseService.selectAll();
    }

    public getDogsByBreed(breed: string) {
        return this._databaseService.select(['Breed'], {
            column: 'Breed',
            value: breed,
        });
    }
}
