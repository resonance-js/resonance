import { NcModule } from '@resonance/core';
import { BreedsRoute } from './breeds.route';
import { BreedsService } from './breeds.service';

@NcModule({
    baseURL: 'breeds',
    declarations: [BreedsService],
    exports: [BreedsService],
    routes: [BreedsRoute],
})
export class BreedsModule {}