import { parse } from './parse';

describe('String parser', () => {
    const testYamlRaw = `hello: world`;
    const testJSONRaw = `{ "hello": "world" }`;
    const testJSONBuffer = Buffer.from(testJSONRaw);
    const testJSONParsed = JSON.parse(testJSONRaw);

    test('Can parse JSON string', (done) => {
        parse(testJSONRaw).subscribe({
            next: (parsed) => {
                expect(JSON.stringify(parsed)).toEqual(
                    JSON.stringify(testJSONParsed)
                );
                done();
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can parse YAML string', (done) => {
        parse(testYamlRaw).subscribe({
            next: (parsed) => {
                expect(JSON.stringify(parsed)).toEqual(
                    JSON.stringify(testJSONParsed)
                );
                done();
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can parse Buffer, no encoding given.', (done) => {
        parse(testJSONBuffer).subscribe({
            next: (parsed) => {
                expect(JSON.stringify(parsed)).toEqual(
                    JSON.stringify(testJSONParsed)
                );
                done();
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can parse Buffer, encoding given.', (done) => {
        parse(testJSONBuffer, 'utf-8').subscribe({
            next: (parsed) => {
                expect(JSON.stringify(parsed)).toEqual(
                    JSON.stringify(testJSONParsed)
                );
                done();
            },
            error: (err) => {
                throw err;
            }
        });
    });
});
