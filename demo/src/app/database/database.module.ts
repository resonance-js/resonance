import { NgModule } from '@resonance/core';
import { DatabaseService } from './database.service';

@NgModule({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
