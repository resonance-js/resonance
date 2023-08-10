import { isNonNullable, sortAscending, sortDescending } from '@resonance/cxjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { concatMap, filter, last, map, of, scan } from 'rxjs';

export interface NcMockDbOptsWhere<T> {
    columnName: keyof T;
    equals: any;
    andOrWhere?: {
        andOr: 'AND' | 'OR';
        columnName: keyof T;
        equals: any;
    }[][];
}

export interface NcMockDbOptsOrderBy<T> {
    column: keyof T;
    dir: 'ASC' | 'DESC';
}

export interface NcMockDbOpts<T> {
    where?: NcMockDbOptsWhere<T>;
    orderBy?: NcMockDbOptsOrderBy<T>;
}

export class Database<T> {
    constructor(public data: T[]) {}

    public select(
        columnNameOrNames: (keyof T)[] | 'ALL',
        opts?: NcMockDbOpts<T>
    ) {
        const queryData = of(...this.data).pipe(
            map((row) => {
                if (Array.isArray(columnNameOrNames)) {
                    columnNameOrNames.forEach((column) => delete row[column]);
                }

                return row;
            }),
            map((row) => {
                const results: {
                    andOr: 'AND' | 'OR';
                    result: boolean;
                }[] = [];

                if (opts?.where) {
                    results.push({
                        andOr: 'AND',
                        result:
                            row[opts.where.columnName] === opts.where.equals,
                    });
                    // TODO
                    // if (opts.where.andOrWhere) {
                    //     opts.where.andOrWhere.forEach((whereGroups) => {
                    //         whereGroups.map(where => {
                    //             if (where.andOr === 'AND') {
                    //                 return {

                    //                 }
                    //             } else {

                    //             }
                    //         })
                    //     });
                    // }
                }

                if (
                    !results.every(
                        (result) =>
                            (result.andOr === 'AND' && result.result) ||
                            result.andOr === 'OR'
                    )
                ) {
                    return null;
                }

                return row;
            }),
            filter(isNonNullable)
        );

        if (opts?.orderBy) {
            const orderBy = opts.orderBy;

            return queryData.pipe(
                scan((rows, row) => {
                    rows.push(row);
                    return rows;
                }, [] as T[]),
                last(),
                map((rows) =>
                    orderBy.dir === 'ASC'
                        ? sortAscending(rows, orderBy.column)
                        : sortDescending(rows, orderBy.column)
                ),
                concatMap((vals) => of(...vals))
            );
        } else {
            return queryData;
        }
    }
}

export const MockDatabase = new Database<Breed>(
    JSON.parse(readFileSync(join(__dirname, 'dogs.json'), 'utf-8'))
);
