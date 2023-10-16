import { isNonNullable } from '@fusion-rx/ts';
import { isJSON } from './json';

export declare type Yaml = string;

export const isYaml = (val: unknown): val is Yaml =>
    isNonNullable(val) && typeof val === 'string' && !isJSON(val);
