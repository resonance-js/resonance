import { ClientRequestArgs as HttpClientRequestArgs } from 'node:http';

export declare type CreateConnectionFunction =
    HttpClientRequestArgs['createConnection'];
