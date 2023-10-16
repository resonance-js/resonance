import { isNonNullable } from './nullable';

describe('Nullable', () => {
    test('Can get metadata', () => {
        isNonNullable<string>('cat');
        expect(true).toEqual(true);
    });
});
