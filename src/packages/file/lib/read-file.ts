import { readFileSync as fsReadFileSync } from 'fs';
import { Observable, of, concatMap, iif, throwError } from 'rxjs';

import { parse } from './parse';
import { existsSync } from './exists-sync';
import { resolve } from './resolve';

export function readFile<T = any>(...pathSegments: string[]): Observable<T> {
    const filePath = resolve(...pathSegments);

    return of(existsSync(filePath)).pipe(
        concatMap((exists) =>
            iif(
                () => exists,
                of(fsReadFileSync(filePath, 'utf-8')),
                throwError(() => {
                    return `Couldn't find file at ${pathSegments}`;
                })
            ).pipe(
                concatMap((rawFile) => {
                    if (
                        filePath.endsWith('json') ||
                        rawFile.trimStart().startsWith('{') ||
                        rawFile.trimStart().startsWith('[')
                    ) {
                        try {
                            return of(JSON.parse(rawFile));
                        } catch (error) {
                            return throwError(() => {
                                return error;
                            });
                        }
                    } else if (filePath.endsWith('yml')) {
                        try {
                            return of(parse(rawFile));
                        } catch (error) {
                            return throwError(() => {
                                return error;
                            });
                        }
                    } else {
                        return of(rawFile as unknown as T);
                    }
                })
            )
        )
    );
}
