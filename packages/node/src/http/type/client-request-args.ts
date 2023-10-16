import { isNonNullable } from '@fusion-rx/ts';
import { LookupFunction } from 'node:net';
import {
    Agent as HttpAgent,
    ClientRequestArgs as HttpClientRequestArgs
} from 'node:http';
import { Agent as HttpsAgent } from 'node:https';

import { HttpHeader } from './http-headers';
import { CreateConnectionFunction } from './create-connection-fn';
import { Hints } from './hints';

export const isClientRequestArgs = (
    val: unknown
): val is HttpClientRequestArgs => {
    return isNonNullable(val) && typeof val === 'object';
};

/**
 * Represents the configuration options for making an HTTP request in Node.js.
 */
export interface ClientRequestArgs extends HttpClientRequestArgs {
    /** Specifies the protocol to use for the request (e.g., "http:" or "https:"). */
    protocol?: 'http' | 'https';

    /** Defines the hostname or IP address of the server to send the request to. */
    host?: string;

    /** Similar to `host`, but without the port number. */
    hostname?: string;

    /** Specifies the port number to use for the connection (e.g., 80 for HTTP or 443 for HTTPS). */
    port?: number | string;

    /** Specifies the path portion of the URL, not including query parameters. */
    path?: string;

    /** Specifies the query parameters portion of the URL. */
    queryParameters?: Record<string, any>;

    /** Specifies the HTTP request method (e.g., "GET," "POST," "PUT," etc.). */
    method?: string;

    /** Key-value pairs representing HTTP headers for the request. */
    headers?: HttpHeader;

    /** Optional authentication information in the format "username:password" for basic authentication. */
    auth?: string;

    /** HTTP/HTTPS Agent object for connection pooling and reuse. */
    agent?: HttpAgent | HttpsAgent;

    /** Timeout for the request in milliseconds. */
    timeout?: number;

    /** Limit on automatic HTTP redirects to follow. */
    maxRedirects?: number;

    /** Whether to reject self-signed SSL certificates. */
    rejectUnauthorized?: boolean;

    /** Whether to set the Host header based on `host` and `port`. */
    setHost?: boolean;

    /** Signal object for aborting the request. */
    signal?: AbortSignal;

    /** Path to a Unix domain socket when connecting to a Unix domain socket server. */
    socketPath?: string;

    /** Enforce uniqueness of header keys. */
    uniqueHeaders?: Array<string | string[]>;

    /** Combine values of duplicate headers. */
    joinDuplicateHeaders?: boolean;

    /** Local IP address for making the network connection. */
    localAddress?: string;

    /** Local port for making the network connection. */
    localPort?: number;

    /** Custom DNS lookup function for hostname resolution. */
    lookup?: LookupFunction;

    /** Maximum allowed size (in bytes) for HTTP headers. @default 1684 */
    maxHeaderSize?: number;

    /** Function to create the underlying socket connection. */
    createConnection?: CreateConnectionFunction;

    /** Default port to use when no `port` is specified in `host`. */
    defaultPort?: number | string;

    /** IP address family to use for the connection (IPv4 or IPv6). */
    family?: number;

    /** Use a more lenient HTTP parser. */
    insecureHTTPParser?: boolean;

    /** Hints for DNS lookup (e.g., desired IP version). */
    hints?: Hints;

    /** Default Agent object for making requests. */
    _defaultAgent?: HttpAgent;
}
