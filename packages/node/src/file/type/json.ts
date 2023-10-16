import { isNonNullable, startsWith } from '@fusion-rx/ts';

export declare type JSON = string;

export const isJSON = (val: unknown): val is JSON =>
    isNonNullable(val) && typeof val === 'string' && startsWith(val, /\{|\[/g);
