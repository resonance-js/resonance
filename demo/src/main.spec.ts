import { Resonance } from '@resonance/core';

import { AppModule } from './app/app.module';

describe('app module', () => {
    let app = new Resonance({
        port: 3002,
    });

    beforeAll((done) => {
        app.boostrap(AppModule).subscribe({
            next: (next) => {
                expect(next.includes('Resonance is listening')).toEqual(true);
            },
            complete: () => {
                expect(true).toEqual(true);
                done();
            },
        });
    });

    test('All imported modules are initialized', () => {
        expect(
            Array.from(app.appRef.imports.values()).every((mdule) =>
                Array.from(mdule.imports.values()).every((importedModule) =>
                    [
                        ...Array.from(importedModule.declarations.values()),
                        ...Array.from(importedModule.exports.values()),
                    ].every((service) => service.instance !== undefined)
                )
            )
        ).toEqual(true);
    });

    afterAll((done) => {
        app.exit().subscribe({
            next: (value) => {
                expect(value.includes('Resonance exited')).toEqual(true);
            },
            complete: () => {
                done();
            },
        });
    });
});
