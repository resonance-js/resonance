import { NcModule } from '@resonance/core';
import { AuthenticationRoutes } from './auth.routes';
import { DatabaseModule } from '../database/database.module';

@NcModule({
    routes: [AuthenticationRoutes],
    imports: [DatabaseModule],
})
export class AuthModule {}
