import { appendFileSync as fsAppendFileSync } from 'fs';
import { resolve } from './resolve';

export function appendFileSync(
    content: string | any,
    ...pathSegments: string[]
): void {
    if (typeof content === 'string') {
        fsAppendFileSync(resolve(...pathSegments), content);
    } else {
        fsAppendFileSync(resolve(...pathSegments), JSON.stringify(content));
    }
}
