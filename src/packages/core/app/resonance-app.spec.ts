import { AppModule } from '../test/app.module';
import { Resonance } from './resonance-app';

describe('Resonance app compiler', () => {
    let app: Resonance;

    beforeAll((done) => {
        app = new Resonance({
            port: 3002,
        });

        app.boostrap(AppModule).subscribe((val) => {
            expect(val.startsWith('Resonance is listening')).toEqual(true);
            done();
        });
    });

    afterAll((done) => {
        app.exit().subscribe((val) => {
            expect(val.startsWith('Resonance exited')).toEqual(true);
            done();
        });
    });

});
