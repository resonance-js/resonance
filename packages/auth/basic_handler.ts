import { throwError, of } from 'rxjs';
import { As } from '../../../cxjs';
import { HttpErrorResponse } from '../router';
import { AuthHandler } from './handler';
import { Request } from 'express';

export class BasicAuthHandler extends AuthHandler {
    public parseAuth(req: Request) {
        if (
            req.headers.authorization &&
            req.headers.authorization.toLowerCase().startsWith('basic')
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
        const headers = atob(authHeader.split(' ')[1]).split(':');

        if (headers.length !== 2) {
            return throwError(() =>
                As<HttpErrorResponse>({
                    statusCode: 401,
                    message: 'Authentication failed. Malformed basic header.',
                })
            );
        }

        return of({
            username: headers[0],
            password: headers[1],
        });
    }
    // constructor(expressApp: Express, routeName: string) {
    //     RouteCatalog.getThen(routeName, (route) => {
    //         route.onInit$.subscribe(() => {
    //             if (route.instance) {
    //                 this._interceptAuthRequests(
    //                     expressApp,
    //                     route.instance as unknown as OnBasicAuthRequest<any>
    //                 );
    //             }
    //         });
    //     });
    // }

    // private _interceptAuthRequests(
    //     expressApp: Express,
    //     handler: OnBasicAuthRequest<any>
    // ) {
    //     expressApp.use((req: Request, res: Response, next: NextFunction) => {
    //         if (
    //             req.headers.authorization &&
    //             req.headers.authorization.toLowerCase().startsWith('basic')
    //         ) {
    //             if (handler) {
    //                 const creds = this._parseAuthHeader(
    //                     req.headers.authorization,
    //                     res
    //                 );

    //                 if (creds) {
    //                     try {
    //                         const authRes = handler.ncOnBasicAuthRequest(creds);
    //                         this._onHandlerResponse(authRes, req, res, next);
    //                     } catch (error) {
    //                         console.error(error);
    //                         this._sendAuthError(res, 'Authentication failed.');
    //                     }
    //                 }
    //             } else this._sendAuthError(res, 'Authentication failed.');
    //         } else {
    //             this._sendAuthError(
    //                 res,
    //                 'Authentication failed. Token not provided.'
    //             );
    //         }
    //     });
    // }

    // private _onHandlerResponse(
    //     authHandlerRes: any,
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     if (isNonNullable(authHandlerRes) && isObservable(authHandlerRes)) {
    //         authHandlerRes.subscribe({
    //             next: (val) => {
    //                 req.headers.authorization = val as any;
    //                 console.log(req.headers.authorization);
    //                 next();
    //             },
    //             error: (err) => {
    //                 res.status(401).send(err);
    //                 res.end();
    //             },
    //         });
    //     } else if (isNonNullable(authHandlerRes)) {
    //         req.headers.authorization = authHandlerRes as any;
    //         next();
    //     } else {
    //         res.status(401).send({
    //             statusCode: 401,
    //             message:
    //                 'A server error ocurred. The basic authentication handler returned no data.',
    //         });
    //     }
    //     next();
    // }

    // private _sendAuthError(res: Response, message: string): void {
    //     res.status(401).send(

    //     );
    // }
}
