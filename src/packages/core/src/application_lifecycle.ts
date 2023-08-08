import { BehaviorSubject } from 'rxjs';

export const $bootstrapped = new BehaviorSubject<boolean>(false);
export const $serverInitialized = new BehaviorSubject<boolean>(false);
export const $routesInitialized = new BehaviorSubject<boolean>(false);