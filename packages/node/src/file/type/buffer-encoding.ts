export const BufferEncodings: BufferEncoding[] = [
    'ascii',
    'utf8',
    'utf-8',
    'utf16le',
    'ucs2',
    'ucs-2',
    'base64',
    'base64url',
    'latin1',
    'binary',
    'hex'
];

export const isBufferEncoding = (val: unknown): val is BufferEncoding => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'string' &&
        BufferEncodings.includes(val as BufferEncoding)
    );
};

export const isBufferLiteral = (val: unknown): val is 'buffer' => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'string' &&
        val === 'buffer'
    );
};

export const extractBufferEncoding = (val: any) =>
    typeof val === 'object' &&
    'encoding' in val &&
    isBufferEncoding(val['encoding'])
        ? val['encoding']
        : undefined;

export const extractBufferLiteral = (val: any) =>
    typeof val === 'object' &&
    'encoding' in val &&
    isBufferLiteral(val['encoding'])
        ? val['encoding']
        : undefined;

export const objsHasBufferEncoding = (
    val: any
): val is {
    encoding: BufferEncoding;
} =>
    typeof val === 'object' &&
    'encoding' in val &&
    BufferEncodings.includes(val['encoding']);

export const objHasBufferLiteral = (
    val: any
): val is {
    encoding: 'buffer';
} =>
    typeof val === 'object' &&
    'encoding' in val &&
    BufferEncodings.includes(val['encoding']);
