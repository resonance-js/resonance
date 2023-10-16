import { Observable, concatMap, iif, throwError } from 'rxjs';
import QueryString from 'qs';
import * as coreHttp from 'http';
import * as coreHttps from 'https';

import { isBufferEncoding } from '../file/type';
import { HttpOptions, httpOptionsToClientReqArgs } from './type';
import { parse } from '../file';

export function request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
    opts: HttpOptions,
    body?: any
): Observable<Buffer | string | T> {
    const options = httpOptionsToClientReqArgs(opts, method);

    return new Observable<{
        statusCode: number;
        response: Buffer | string;
    }>((subscriber) => {
        const chunks: Buffer[] = [];

        const req = (
            options.nativeArgs.protocol === ':https' ? coreHttps : coreHttp
        ).request(options.nativeArgs, (res) =>
            res
                .on('data', (chunk: any) => chunks.push(chunk))
                .on('error', (err) => subscriber.error(err))
                .on('end', () => {
                    subscriber.next({
                        statusCode: res.statusCode ?? 200,
                        response: Buffer.concat(chunks)
                    });
                    subscriber.complete();
                })
        );

        if (body) {
            // TODO: Do other content types require specific body types? Can this be abstracted?
            if (
                options.nativeArgs.method === 'POST' &&
                options.nativeArgs.headers?.['Content-Type'] ===
                    'application/x-www-form-urlencoded'
            ) {
                req.write(QueryString.stringify(body));
            } else {
                req.write(JSON.stringify(body));
            }
        }

        req.end();
    }).pipe(
        concatMap((res) =>
            iif(
                () => res.statusCode > 100 && res.statusCode < 400,
                Buffer.isBuffer(res.response)
                    ? parse<T>(
                          res.response,
                          isBufferEncoding(options.encoding)
                              ? options.encoding
                              : 'utf-8'
                      )
                    : parse<T>(res.response),
                throwError(() => ({
                    statusCode: res.statusCode,
                    response: Buffer.isBuffer(res.response)
                        ? res.response.toString('utf-8')
                        : res.response
                }))
            )
        )
    );
}
