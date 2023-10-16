import { NgModule } from '@resonance/core';
import { AuthenticationRoutes } from './auth.routes';
import { DatabaseModule } from '../database/database.module';

@NgModule({
    routes: [AuthenticationRoutes],
    imports: [DatabaseModule],
})
export class AuthModule {}
