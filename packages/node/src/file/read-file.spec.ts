import { join } from 'path';
import { readFile } from './read-file';
import {
    existsSync,
    readFileSync as fsReadFileSync,
    rmSync,
    writeFileSync
} from 'fs';
import { parse, stringify } from 'yaml';
import { firstValueFrom } from 'rxjs';

describe('Read File', () => {
    const testFilePath = join(__dirname, 'test.json');
    const testFile = {
        hello: 'world'
    };

    const testYamlPath = join(__dirname, 'test.yaml');
    const testYaml = parse('hello: world');

    beforeAll(() => {
        if (!existsSync(testFilePath) && !existsSync(testYamlPath)) {
            writeFileSync(testFilePath, JSON.stringify(testFile));
            writeFileSync(testYamlPath, stringify(testYaml));
        }
    });

    afterAll(() => {
        rmSync(testFilePath);
        rmSync(testYamlPath);
    });

    test('Can read file', (done) => {
        readFile(testFilePath, 'utf-8').subscribe({
            next: (val) => {
                expect(typeof val).toEqual('string');
                expect(val).toEqual(fsReadFileSync(testFilePath, 'utf-8'));
            },
            error: (err) => {
                throw err;
            },
            complete: () => done()
        });
    });

    test('Can read file, buffer', async () => {
        const val = await firstValueFrom(readFile(testFilePath));
        expect(Buffer.isBuffer(val)).toEqual(true);

        const fsVal = fsReadFileSync(testFilePath);
        expect(Buffer.isBuffer(fsVal)).toEqual(true);
        expect(val.toString('utf-8')).toEqual(fsVal.toString('utf-8'));
    });

    test('Can read file; encoding provided', (done) => {
        readFile(testYamlPath, 'utf-8').subscribe({
            next: (val) => {
                expect(stringify(val)).toEqual(
                    fsReadFileSync(testYamlPath, 'utf-8')
                );
            },
            error: (err) => {
                throw err;
            },
            complete: () => done()
        });
    });

    test('Can read and parse yaml file', (done) => {
        readFile<any>(testYamlPath, true).subscribe({
            next: (val) => {
                expect(stringify(val)).toEqual(
                    stringify(parse(fsReadFileSync(testYamlPath, 'utf-8')))
                );
            },
            error: (err) => {
                throw err;
            },
            complete: () => done()
        });
    });

    test('Can read and parse file, no encoding given', (done) => {
        readFile<any>(testFilePath, true).subscribe({
            next: (val) => {
                expect(JSON.stringify(val)).toEqual(
                    fsReadFileSync(testFilePath, 'utf-8')
                );
            },
            error: (err) => {
                throw err;
            },
            complete: () => done()
        });
    });
});
