import { Get, OnBasicAuthRequest, Route } from '@resonance/core';
import { DatabaseService } from '../database/database.service';
import { of } from 'rxjs';
import { AuthGuard } from '@resonance/core/src/di';

@Route('authentication')
export class AuthenticationRoutes implements OnBasicAuthRequest<any> {
    //@ts-ignore
    constructor(private _databaseService: DatabaseService) {}

    ncOnBasicAuthRequest(credentials: { username: string; password: string }) {
        return of({
            username: credentials.username,
            loginTime: new Date().toISOString(),
            firstname: 'John',
            lastname: 'Doe',
        });
    }

    @AuthGuard('basicAuth')
    @Get('authorize')
    public authorizeUser() {
        return true;
    }
}
