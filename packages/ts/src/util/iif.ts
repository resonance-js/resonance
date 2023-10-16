/**
 * @param iff Callback that evaluates something.
 * @param trueCallback Executed when `iff` returns true.
 * @param falseCallback (optional) Executed when `iff` returns false.
 * @returns An element of type T.
 */
export const iff = <T = any>(
    iff: () => boolean,
    trueCallback: () => T,
    falseCallback?: () => T
): T | null => {
    if (iff()) return trueCallback();
    if (falseCallback) return falseCallback();
    return null;
};
