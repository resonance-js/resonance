import { formatDate } from './formatDate';

describe('Format Date', () => {
    const date = new Date(2025, 5, 15, 15, 15, 15, 155);

    test('Can format standard date, AM/PM', () => {
        const d = formatDate(date, 'dd', 'mm', 'yyyy', 'HH', 'MM', 'SS', 'a');
        expect(d).toEqual('15/05/2025 03:15:15 PM');
    });

    test('Can format standard date', () => {
        const d = formatDate(date, 'dd', 'mm', 'yyyy', 'HH', 'MM', 'SS');
        expect(d).toEqual('15/05/2025 15:15:15');
    });
});
