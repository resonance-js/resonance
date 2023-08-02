import { Resonance } from '@resonance/core';
import { AppModule } from './app/app.module';

let app = new Resonance({
    port: 3002,
});

app.boostrap(AppModule).subscribe();
