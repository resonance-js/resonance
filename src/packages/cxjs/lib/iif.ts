export function iff<T = any>(
    iff: boolean,
    trueCallback: () => T,
    falseCallback: () => T
): T;

export function iff<T = any>(iff: boolean, trueCallback: () => T): T | void;

export function iff<T = any>(
    iff: boolean,
    trueCallback: () => T,
    falseCallback?: () => T
): T | void {
    if (iff) {
        return trueCallback();
    } else if (falseCallback) {
        return falseCallback();
    }
}
