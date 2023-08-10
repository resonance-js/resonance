import { NcModule } from '@resonance/core';
import { BreedsService } from './breeds.service';
import { BreedsRoute } from './breeds.routes';
import { DatabaseModule } from '../database/database.module';

@NcModule({
    declarations: [BreedsService],
    exports: [BreedsService],
    routes: [BreedsRoute],
    imports: [DatabaseModule],
})
export class BreedsModule {}
