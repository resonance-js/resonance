import { NcModule } from '@resonance/core';
import { DatabaseService } from './database.service';

@NcModule({
    declarations: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
