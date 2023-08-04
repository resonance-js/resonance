import { Injectable } from '@resonance/core';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DogService {
    constructor(private _databaseService: DatabaseService) {}

    public getAllDogs() {
        return this._databaseService.selectAll();
    }

    public getDogByID(id: number) {
        return this._databaseService.select(undefined, {
            column: 'id',
            value: id,
        });
    }
}
