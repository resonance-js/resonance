export interface HttpErrorResponse {
    statusCode: number;
    message: string;
    response?: any;
    stack?: any;
}

export const isHttpErrorResponse = (val: unknown): val is HttpErrorResponse => {
    return (
        val !== undefined &&
        val !== null &&
        typeof val === 'object' &&
        'statusCode' in val &&
        'message' in val
    );
};
