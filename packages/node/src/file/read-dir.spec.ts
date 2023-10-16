import { readdir } from './read-dir';
import { readdir as fsreaddir } from 'fs/promises';

describe('Read Dir', () => {
    test('Can read directory', (done) => {
        readdir(__dirname).subscribe({
            next: (val) => {
                fsreaddir(__dirname)
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            },
            complete: () => done()
        });
    });

    test('Can read directory recursive', (done) => {
        readdir(__dirname, {
            recursive: true
        }).subscribe({
            next: (val) => {
                fsreaddir(__dirname, {
                    recursive: true
                })
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can read directory with file types', (done) => {
        readdir(__dirname, {
            withFileTypes: true
        }).subscribe({
            next: (val) => {
                fsreaddir(__dirname, {
                    withFileTypes: true
                })
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can read directory with file types and recursive', (done) => {
        readdir(__dirname, {
            withFileTypes: true,
            recursive: true
        }).subscribe({
            next: (val) => {
                fsreaddir(__dirname, {
                    withFileTypes: true,
                    recursive: true
                })
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can read directory with file types, recursive, buffer encoding', (done) => {
        readdir(__dirname, {
            withFileTypes: true,
            recursive: true,
            encoding: 'utf-8'
        }).subscribe({
            next: (val) => {
                fsreaddir(__dirname, {
                    withFileTypes: true,
                    recursive: true,
                    encoding: 'utf-8'
                })
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            }
        });
    });

    test('Can read directory with recursive, buffer', (done) => {
        readdir(__dirname, {
            recursive: true,
            encoding: 'buffer'
        }).subscribe({
            next: (val) => {
                fsreaddir(__dirname, {
                    recursive: true,
                    encoding: 'buffer'
                })
                    .then((res) =>
                        expect(JSON.stringify(val)).toEqual(JSON.stringify(res))
                    )
                    .finally(() => done());
            },
            error: (err) => {
                throw err;
            }
        });
    });
});
