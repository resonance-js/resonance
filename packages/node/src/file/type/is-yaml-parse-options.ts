import { ParseOptions } from 'yaml';
import { isNonNullable } from '@fusion-rx/ts';

export declare type YamlParseOptions = ParseOptions;

const hasSomeParseOptions = (val: any) =>
    'intAsBigInt' in val ||
    'keepSourceTokens' in val ||
    'prettyErrors' in val ||
    'strict' in val ||
    'uniqueKeys' in val;

export const isYamlParseOptions = (val: unknown): val is YamlParseOptions =>
    isNonNullable(val) && typeof val === 'object' && hasSomeParseOptions(val);
