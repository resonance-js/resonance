import { SubjectLike, Subscribable } from 'rxjs';

export type Class =
    | {
          constructor: (...args: any[]) => void;
          [classMember: string]:
              | Function
              | boolean
              | number
              | string
              | Subscribable<any>
              | SubjectLike<any>
              | any;
      }
    | Function
    | any;
