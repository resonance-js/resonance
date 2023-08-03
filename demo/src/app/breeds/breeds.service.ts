import { of, map } from 'rxjs';
import { HttpErrorResponse, Injectable } from '@resonance/core';
import { As } from '@resonance/cxjs';

@Injectable()
export class BreedsService {
    public breeds: Breed[] = [
        {
            name: 'German Shepheard',
            primaryColor: 'brown',
            secondaryColor: 'black',
            coat: 'hair',
        },
        {
            name: 'Bulldog',
            primaryColor: 'white',
            secondaryColor: 'brown',
            coat: 'hair',
        },
        {
            name: 'Golden Retreiver',
            primaryColor: 'yellow',
            coat: 'fur',
        },
        {
            name: 'Siberian Husky',
            primaryColor: 'black',
            secondaryColor: 'white',
            coat: 'fur',
        },
    ];

    constructor() {}

    addBreed(breed: Breed) {
        this.breeds.push(breed);
    }

    removeBreed(name: string) {
        this.breeds.splice(
            this.breeds.findIndex((breed) => breed.name === name),
            1
        );
    }

    getBreed(name: string) {
        return of(this.breeds.find((breed) => breed.name === name)).pipe(
            map((breed) => {
                if (breed === undefined) {
                    throw As<HttpErrorResponse>({
                        statusCode: 404,
                        message: 'Breed with name ' + name + ' not found.',
                        stack: new Error(),
                    });
                }

                breed;
            })
        );
    }
}
