import { OutgoingHttpHeader } from 'http';
import { MIME } from './mime';

export declare interface HttpHeader extends NodeJS.Dict<OutgoingHttpHeader> {
    Authorization?: string;
    'Cache-Control'?: string;
    'Content-Length'?: number;
    'Content-Type'?: MIME;
    'Content-Encoding'?: 'gzip' | 'compress' | 'deflate' | 'br';
}
