export function ifNotNull<R = any, T = any, R_else = any>(
    varT: T,
    callbacks: {
        then: (varT: T) => R;
        else: () => R_else;
    }
): R;
export function ifNotNull<R = any, T = any, A = any>(
    varT: T,
    varA: A,
    callbacks: {
        then: (varT: T, varA: A) => R;
        else: () => R;
    }
): R;
export function ifNotNull<R = any, T = any, A = any, B = any>(
    varT: T,
    varA: A,
    varB: B,
    callbacks: {
        then: (varT: T, varA: A, varB: B) => R;
        else: () => R;
    }
): R;
export function ifNotNull<R = any, T = any, A = any, B = any, C = any>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    callbacks: {
        then: (varT: T, varA: A, varB: B, varC: C) => R;
        else: () => R;
    }
): R;
export function ifNotNull<R = any, T = any, A = any, B = any, C = any, D = any>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    callbacks: {
        then: (varT: T, varA: A, varB: B, varC: C, varD: D) => R;
        else: () => R;
    }
): R;
export function ifNotNull<
    R = any,
    T = any,
    A = any,
    B = any,
    C = any,
    D = any,
    E = any
>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    varE: E,
    callbacks: {
        then: (varT: T, varA: A, varB: B, varC: C, varD: D, varE: E) => R;
        else: () => R;
    }
): R;
export function ifNotNull<
    R = any,
    T = any,
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any
>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    varE: E,
    varF: F,
    callbacks: {
        then: (
            varT: T,
            varA: A,
            varB: B,
            varC: C,
            varD: D,
            varE: E,
            varF: F
        ) => R;
        else: () => R;
    }
): R;
export function ifNotNull<
    R = any,
    T = any,
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any,
    G = any
>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    varE: E,
    varF: F,
    varG: G,
    callbacks: {
        then: (
            varT: T,
            varA: A,
            varB: B,
            varC: C,
            varD: D,
            varE: E,
            varF: F,
            varG: G
        ) => R;
        else: () => R;
    }
): R;
export function ifNotNull<
    R = any,
    T = any,
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any,
    G = any,
    H = any
>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    varE: E,
    varF: F,
    varG: G,
    varH: H,
    callbacks: {
        then: (
            varT: T,
            varA: A,
            varB: B,
            varC: C,
            varD: D,
            varE: E,
            varF: F,
            varG: G,
            varH: H
        ) => R;
        else: () => R;
    }
): R;
export function ifNotNull<
    R = any,
    T = any,
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any,
    G = any,
    H = any,
    I = any
>(
    varT: T,
    varA: A,
    varB: B,
    varC: C,
    varD: D,
    varE: E,
    varF: F,
    varG: G,
    varH: H,
    varI: I,
    callbacks: {
        then: (
            varT: T,
            varA: A,
            varB: B,
            varC: C,
            varD: D,
            varE: E,
            varF: F,
            varG: G,
            varH: H,
            varI: I
        ) => R;
        else: () => R;
    }
): R;

export function ifNotNull(...args: any[]) {
    const callbacks = args.pop() as {
        then: (...args: any[]) => any;
        else: () => any;
    };

    if (args.includes(undefined) || args.includes(null)) {
        return callbacks.else();
    } else {
        return callbacks.then(...args);
    }
}
