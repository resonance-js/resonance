import { isNonNullable } from '../type';
import { round } from './round';

export function prependZeros(
    num: any,
    returnLength: number,
    precision?: number
) {
    const _num: string = String(num);

    if (_num.length === returnLength) return _num;
    if (_num.length > returnLength && isNonNullable(precision))
        return round(num, precision);
    else {
        const zeros = new Array<string>(returnLength - _num.length)
            .fill('0')
            .join('');
        console.log(zeros);
        return zeros + _num;
    }
}
