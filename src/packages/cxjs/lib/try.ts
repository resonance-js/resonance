/**
 * Allows for more dynamic try/catches that always return a valid value.
 * @T The return type of the initial try.
 * @E The return type of any thrown errors.
 */
export interface Trier<T = any, T_res = any, E = any> {
    /** Executed if `tier` errors. Always returns a valid object of type T.*/
    catch: (error: E) => void;
    /** Executed regardless of the outcome. */
    finally: (tryRes: T_res | undefined) => T | undefined;
}

/**
 * Reduces the footprint of `try/catch` and allows for the omission of the
 * `catch`.
 *
 * @param trier The callback that will be executed in the `try` block.
 * @param logError (optional) Whether any errors should be logged.
 */
export function tryCatch<T = any>(trier: () => T, logError?: boolean): T | void;

/**
 * Reduces the footprint of the `try/catch` and allows for the omission of the
 * `catch`.
 *
 * @param trier The callback that will be executed in the `try` block.
 * @param callbacks Callbacks for error and finally blocks.
 * @param logError (optional) Whether any errors should be logged.
 */
export function tryCatch<T = any, T_Res = any, E = any>(
    trier: () => T_Res,
    callbacks: Partial<Trier<T, T_Res, E>>,
    logError?: boolean
): T | T_Res | undefined;

export function tryCatch(trier: () => any, ...args: any[]) {
    let callbacks: Partial<Trier>;
    let logError: boolean;

    switch (args.length) {
        case 2:
            callbacks = args[0];
            logError = args[1];
            break;
        case 1:
            if (typeof args[0] === 'boolean') {
                logError = args[0];
                callbacks = {};
            } else {
                logError = false;
                callbacks = args[0];
            }
            break;
        default:
            logError = false;
            callbacks = {};
    }

    let tryRes: any;

    try {
        tryRes = trier();
    } catch (err) {
        if (logError) console.error(err);
        if (callbacks.catch) {
            return callbacks.catch(err);
        }
    } finally {
        if (callbacks.finally) {
            return callbacks.finally(tryRes);
        } else {
            return tryRes;
        }
    }
}
