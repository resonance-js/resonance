export type ValidSchemaTypes =
    | 'string'
    | 'boolean'
    | 'number'
    | 'double'
    | 'Date'
    | 'array<string>'
    | 'array<number>'
    | 'array<object>';

export interface Schema<T> {
    path?: string;
    type: 'GET' | 'PUT' | 'POST' | 'DELETE';
    method: keyof T;
    summary?: string;
    parameters?: {
        [paramName: string]: {
            type: ValidSchemaTypes;
            optional?: boolean;
        };
    };
    queries?: {
        [paramName: string]: {
            type: ValidSchemaTypes;
            optional?: boolean;
        };
    };
}
