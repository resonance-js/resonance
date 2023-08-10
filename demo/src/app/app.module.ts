import { NcModule } from '@resonance/core';
import { BreedsModule } from './breeds/breeds.module';
import { DogModule } from './dogs/dogs.module';

@NcModule({
    baseURL: 'api',
    imports: [BreedsModule, DogModule],
})
export class AppModule {}
