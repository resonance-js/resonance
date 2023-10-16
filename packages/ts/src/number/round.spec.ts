import { round } from './round';

describe('Rounding', () => {
    test('Can round down and parse', () => {
        const val = round(250, 2, true);
        expect(val).toEqual(25);
    });

    test('Can round down and no parse', () => {
        const val = round(250, 2);
        expect(val).toEqual(25);
    });
});
