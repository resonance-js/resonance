import { ClientRequestArgs as HttpClientRequestArgs } from 'node:http';
import QueryString from 'qs';

import { ClientRequestArgs } from './client-request-args';
import { isNonNullable } from '@fusion-rx/ts';

export declare type ClientRequestPathLike = string | string[];

export declare type HttpOptions = {
    queryParameters?: Record<string, any>;
    path?: ClientRequestPathLike;
    /** @default 'utf-8' */
    encoding?: 'buffer' | BufferEncoding;
    /** @default true */
    parse?: boolean;
} & Omit<Omit<ClientRequestArgs, 'path'>, 'method'>;

export const httpOptionsToClientReqArgs = (
    opts: HttpOptions,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
): {
    nativeArgs: HttpClientRequestArgs;
    encoding: 'buffer' | BufferEncoding;
    parse: boolean;
} => {
    if (opts.path) {
        opts['path'] = Array.isArray(opts.path)
            ? opts.path.join('/')
            : opts.path;

        if (!opts.path.startsWith('/')) opts.path = '/' + opts.path;

        if (opts.queryParameters) {
            opts['path'] =
                opts['path'] +
                '?' +
                QueryString.stringify(opts.queryParameters);
            delete opts.queryParameters;
        }
    }

    let protocol = 'http:';

    if (opts.protocol) {
        protocol = opts.protocol + ':';
        delete opts.protocol;
    }

    let encoding: 'buffer' | BufferEncoding = 'utf-8';

    if (opts.encoding) {
        encoding = opts.encoding;
        delete opts.encoding;
    }

    let parse = true;

    if (isNonNullable<boolean>(opts.parse)) {
        parse = opts.parse;
        delete opts.parse;
    }

    return {
        nativeArgs: {
            method,
            protocol,
            ...opts
        } as HttpClientRequestArgs,
        encoding,
        parse
    };
};
