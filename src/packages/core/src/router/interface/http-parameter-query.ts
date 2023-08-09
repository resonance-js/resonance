export interface HttpArgument {
    name: string;
    index: number;
    required: boolean;
}

export interface HttpArguments {
    param: HttpArgument[];
    query: HttpArgument[];
}
