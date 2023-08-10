import { throwError, of } from 'rxjs';
import { As, isNullable } from '../../../cxjs';
import { HttpErrorResponse } from '../router';
import { AuthHandler } from './handler';
import { Request } from 'express';

export class BearerAuthHandler extends AuthHandler {
    public parseAuth(req: Request) {
        if (
            req.headers.authorization &&
            req.headers.authorization.toLowerCase().startsWith('bearer')
        ) {
            return this._parseAuthHeader(req.headers.authorization);
        } else {
            return throwError(() =>
                As<HttpErrorResponse>({
                    statusCode: 401,
                    message: 'Authentication failed. Token not provided.',
                })
            );
        }
    }

    private _parseAuthHeader(authHeader: string) {
        const headers = authHeader.split(' ')[1];

        if (isNullable(headers)) {
            return throwError(() =>
                As<HttpErrorResponse>({
                    statusCode: 401,
                    message: 'Authentication failed. Malformed bearer token.',
                })
            );
        }

        return of({
            username: headers[0],
            password: headers[1],
        });
    }
}
