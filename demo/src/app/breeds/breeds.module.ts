import { NcModule } from '@resonance/core';
import { BreedsService } from './breeds.service';
import { BreedsRoute } from './breeds.route';

@NcModule({
    baseURL: 'breeds',
    declarations: [BreedsService],
    exports: [BreedsService],
    routes: [BreedsRoute],
})
export class BreedsModule {}
