/**
 * A function type interface that describes a function that accepts one parameter `T`
 * and returns another parameter `R`.
 *
 * Usually used to describe {@link OperatorFunction} - it always takes a single
 * parameter (the source Observable) and returns another Observable.
 *
 * @author RxJS
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/types.ts
 */
export interface UnaryFunction<T, R> {
    (source: T): R;
}

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A>(seed: T, fn1: UnaryFunction<T, A>): A;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>
): B;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>
): C;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>
): D;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>
): E;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E, F>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>,
    fn6: UnaryFunction<E, F>
): F;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E, F, G>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>,
    fn6: UnaryFunction<E, F>,
    fn7: UnaryFunction<F, G>
): G;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E, F, G, H>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>,
    fn6: UnaryFunction<E, F>,
    fn7: UnaryFunction<F, G>,
    fn8: UnaryFunction<G, H>
): H;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E, F, G, H, I>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>,
    fn6: UnaryFunction<E, F>,
    fn7: UnaryFunction<F, G>,
    fn8: UnaryFunction<G, H>,
    fn9: UnaryFunction<H, I>
): I;

/**
 * Utility that allows operation on a seed variable without setting a variable.
 * @param seed The initial value that will be passed through the pipe
 * @param fn1 The first UnaryFunction that will do work on the seed.
 * @author RxJS, Alexander Porrello
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe<T, A, B, C, D, E, F, G, H, I>(
    seed: T,
    fn1: UnaryFunction<T, A>,
    fn2: UnaryFunction<A, B>,
    fn3: UnaryFunction<B, C>,
    fn4: UnaryFunction<C, D>,
    fn5: UnaryFunction<D, E>,
    fn6: UnaryFunction<E, F>,
    fn7: UnaryFunction<F, G>,
    fn8: UnaryFunction<G, H>,
    fn9: UnaryFunction<H, I>,
    ...fns: UnaryFunction<any, any>[]
): unknown;

/**
 * Pipe() can be called on one or more functions, each of which can take one argument ("UnaryFunction")
 * and uses it to return a value.
 * It returns a function that takes one argument, passes it to the first UnaryFunction, and then
 * passes the result to the next one, passes that result to the next one, and so on.
 *
 * @author RxJS
 * @url https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 */
export function Pipe(seed: any, ...fns: Array<UnaryFunction<any, any>>): any {
    const fn1 = fns.shift() as UnaryFunction<any, any>;
    let val = fn1(seed);
    fns.forEach((fn) => (val = fn(val)));
    return val;
}
