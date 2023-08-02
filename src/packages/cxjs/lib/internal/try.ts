export interface Try<T = any, T_Res = any> {
    try: () => T | void;
    catch?: (error: any) => T | void;
    finally: (tryResult: T | void) => T_Res;
    logError?: boolean;
}
