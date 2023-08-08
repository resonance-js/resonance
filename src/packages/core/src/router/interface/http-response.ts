export interface HttpResponse<T = any> {
    status: number;
    payload?: T | null | undefined;
    message?: string;
}
