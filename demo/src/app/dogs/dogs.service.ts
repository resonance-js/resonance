import { Injectable } from '@resonance/core';
import { isNonNullable } from '@resonance/cxjs';
import { DatabaseService } from '../database/database.service';
import { filter } from 'rxjs';

@Injectable()
export class DogService {
    constructor(private _databaseService: DatabaseService) {}

    public getAllDogs() {
        return this._databaseService.selectAll();
    }

    public queryDogs(query?: { age?: number }) {
        console.log(query);
        return this._databaseService.selectAll().pipe(
            filter((dog) => {
                if (isNonNullable(query)) {
                    if (isNonNullable(query.age)) {
                        return dog.Age === query.age;
                    }
                }

                return true;
            })
        );
    }

    public getDogByID(id: number) {
        return this._databaseService.select(undefined, {
            column: 'id',
            value: id,
        });
    }
}
