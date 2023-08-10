import { NcModule } from '@resonance/core';
import { DogService } from './dogs.service';
import { DogRoutes } from './dogs.routes';
import { DatabaseModule } from '../database/database.module';

@NcModule({
    baseURL: 'dog',
    declarations: [DogService],
    exports: [DogService],
    routes: [DogRoutes],
    imports: [DatabaseModule],
})
export class DogModule {}
