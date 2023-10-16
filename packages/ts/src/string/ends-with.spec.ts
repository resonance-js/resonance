import { endsWith } from './ends-with';

describe('Ends with', () => {
    test('Evaluates regular expressions; false.', () => {
        expect(endsWith('Hello world', /Hello/g)).toEqual(false);
    });

    test('Evaluates regular expressions; true.', () => {
        expect(endsWith('Hello world', /world/g)).toEqual(true);
    });

    test('Evaluates regular expressions; multiple.', () => {
        expect(endsWith('Hello world', /Hello|world/g)).toEqual(true);
    });

    test('Evaluates regular expressions; multiple 2.', () => {
        expect(endsWith('Hello world', /world|Hello/g)).toEqual(true);
    });

    test('Evaluates arrays; false.', () => {
        expect(endsWith('Hello world', ['Hello'])).toEqual(false);
    });

    test('Evaluates arrays; true.', () => {
        expect(endsWith('Hello world', ['world'])).toEqual(true);
    });

    test('Evaluates arrays; multiple.', () => {
        expect(endsWith('Hello world', ['Hello', 'world'])).toEqual(true);
    });

    test('Evaluates strings; false.', () => {
        expect(endsWith('Hello world', 'Hello')).toEqual(false);
    });

    test('Evaluates strings; true.', () => {
        expect(endsWith('Hello world', 'world')).toEqual(true);
    });

    test('Evaluates strings; case insenstivie; true.', () => {
        expect(
            endsWith('Hello world', 'World', {
                caseSensitive: false
            })
        ).toEqual(true);
    });

    test('Evaluates arrays; case insenstivie; true.', () => {
        expect(
            endsWith('Hello world', ['hello', 'World'], {
                caseSensitive: false
            })
        ).toEqual(true);
    });
});
