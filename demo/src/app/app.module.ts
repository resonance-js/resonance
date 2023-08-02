import { NcModule } from '@resonance/core';
import { BreedsModule } from './breeds/breeds.module';

@NcModule({
    baseURL: 'api',
    imports: [BreedsModule],
})
export class AppModule {}