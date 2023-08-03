export interface EvalNullT<T = any, T_Res = any> {
    if: (variable: T) => T_Res;
    else: () => T_Res;
}

export interface EvalNullTA<T = any, A = any, T_Res = any> {
    if: (variable: T, variableA: A) => T_Res;
    else: () => T_Res;
}

export interface EvalNullTAB<T = any, A = any, B = any, T_Res = any> {
    if: (variable: T, variableA: A, variableB: B) => T_Res;
    else: () => T_Res;
}

export interface EvalNullTABC<T = any, A = any, B = any, C = any, T_Res = any> {
    if: (variable: T, variableA: A, variableB: B, variableC: C) => T_Res;
    else: () => T_Res;
}

export interface EvalNullTABCD<
    T = any,
    A = any,
    B = any,
    C = any,
    T_Res = any
> {
    if: (variable: T, variableA: A, variableB: B, variableC: C) => T_Res;
    else: () => T_Res;
}

export function isEvalNullT<T = any, T_Res = any>(
    evalNull: any
): evalNull is EvalNullT<T, T_Res> {
    return evalNull['if'] !== undefined && evalNull['else'] !== undefined;
}

export function isEvalNullTA<T = any, A = any, T_Res = any>(
    evalNull: any
): evalNull is EvalNullTA<T, A, T_Res> {
    return evalNull['if'] !== undefined && evalNull['else'] !== undefined;
}

export function isEvalNullTAB<T = any, A = any, B = any, T_Res = any>(
    evalNull: any
): evalNull is EvalNullTAB<T, A, B, T_Res> {
    return evalNull['if'] !== undefined && evalNull['else'] !== undefined;
}

export function isEvalNullTABC<T = any, A = any, B = any, T_Res = any>(
    evalNull: any
): evalNull is EvalNullTABC<T, A, B, T_Res> {
    return evalNull['if'] !== undefined && evalNull['else'] !== undefined;
}

export function isEvalNullTABCD<
    T = any,
    A = any,
    B = any,
    C = any,
    T_Res = any
>(evalNull: any): evalNull is EvalNullTABCD<T, A, B, C, T_Res> {
    return evalNull['if'] !== undefined && evalNull['else'] !== undefined;
}
