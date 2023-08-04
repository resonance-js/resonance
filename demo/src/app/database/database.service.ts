import { Injectable } from '@resonance/core';
import { deepCopy } from '@resonance/cxjs';
import console from 'console';
import { readFileSync } from 'fs';
import { join } from 'path';
import { filter, map, of } from 'rxjs';

let instanceNum = 0;

@Injectable()
export class DatabaseService {
    public data: Breed[] = JSON.parse(
        readFileSync(join(__dirname, 'dogs.json'), 'utf-8')
    );

    constructor() {
        console.log(instanceNum++);
    }

    public selectAll() {
        return of(...this.data).pipe(map((val) => deepCopy(val)));
    }

    public select(
        columns?: (keyof Breed)[],
        ...where: {
            column: keyof Breed;
            value: any;
        }[]
    ) {
        return (
            columns
                ? this.selectAll().pipe(
                      map((row) => {
                          Object.keys(row).forEach((column) => {
                              if (!columns.includes(column as keyof Breed)) {
                                  delete row[column as keyof Breed];
                              }
                          });

                          return row;
                      })
                  )
                : this.selectAll()
        ).pipe(
            filter((row) => {
                const hasVal = where.every((where) => {
                    console.log(where);
                    console.log(row[where.column], where.value);
                    return row[where.column] === where.value;
                });
                console.log(hasVal);
                return where.length > 0 ? hasVal : false;
            })
        );
    }
}
