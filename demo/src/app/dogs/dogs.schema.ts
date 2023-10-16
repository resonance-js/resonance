import { Schema } from '../../../../dist/express';
import { DogsController } from './dogs.controller';

export const DogsSchema: Schema<DogsController>[] = [
    {
        method: 'getAllDogs',
        type: 'GET',
    },
    {
        method: 'queryDogs',
        type: 'GET',
        queries: {
            age: {
                type: 'number',
                optional: true,
            },
        },
    },
    {
        method: 'getDogByID',
        type: 'GET',
        params: {
            id: {
                type: 'number',
            },
        },
    },
];
