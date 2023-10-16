import { parseNumber } from '../number';

export function round(value: number, precision?: number, parse?: boolean) {
    console.log(
        parseNumber('.' + Array(String(value).length).fill('0').join('') + 1)
    );
    value =
        value *
        Number(
            '.' +
                Array(String(value).length - 1)
                    .fill('0')
                    .join('') +
                1
        );
    var multiplier = Math.pow(10, precision ?? 0);
    const rounded =
        `${Math.round(value * multiplier) / multiplier}`.split('.')[1] ?? `0`;
    return parse ? Number(rounded) : rounded;
}
