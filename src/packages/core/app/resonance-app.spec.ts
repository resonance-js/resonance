import { concatMap } from 'rxjs';
import { AppModule } from '../test/app.module';
import { Resonance } from './resonance-app';

describe('Resonance app compiler', () => {
    test('Should bootstrap Resonance app.', (done) => {
        const app = new Resonance({
            port: 3002,
        });

        app.boostrap(AppModule)
            .pipe(
                concatMap((val) => {
                    expect(val.startsWith('Resonance is listening')).toEqual(
                        true
                    );
                    return app.exit();
                })
            )
            .subscribe({
                next: (val) => {
                    expect(val.startsWith('Resonance exited')).toEqual(true);
                    done();
                },
            });
    });
});
