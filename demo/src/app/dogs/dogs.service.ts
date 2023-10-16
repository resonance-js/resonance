import { Injectable } from '@resonance/core';
import { isNonNullable } from '@resonance/cxjs';
import { DatabaseService } from '../database/database.service';
import { filter } from 'rxjs';
import { Controller } from '@nestjs/common';

@Injectable()
export class DogService {
    constructor(private _databaseService: DatabaseService) {}

    public getAllDogs() {
        return this._databaseService.selectAll();
    }

    @Controller({
        method: 'queryDogs',
        type: 'GET',
        queries: {
            age: {
                type: 'number',
                optional: true,
            },
        },
    })
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
