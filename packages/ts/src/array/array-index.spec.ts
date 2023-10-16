import { getMetadata } from '../reflect';
import { arrayIndex } from './array-index';
import { SeinfeldCharacters } from './sample-array.spec';

describe('Array Index', () => {
    test('It should apply index to each element in array', () => {
        const indexedArray = arrayIndex(SeinfeldCharacters);

        indexedArray.forEach((value, index) => {
            expect(getMetadata('_index', value)).toEqual(index);
        });
    });
});
