export interface HttpArgument {
    name: string;
    index: number;
    required: boolean;
    type: 'number' | 'array' | 'string' | 'boolean' | 'object' | 'date';
}

export interface HttpArguments {
    param: HttpArgument[];
    query: HttpArgument[];
}
