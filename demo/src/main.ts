import { Resonance } from '@resonance/core';
import { AppModule } from './app/app.module';
import { DogsSchema } from './app/dogs/dogs.schema';

let app = new Resonance({
    port: 3002,
});

app.boostrap(AppModule).listen(DogsSchema).init();
