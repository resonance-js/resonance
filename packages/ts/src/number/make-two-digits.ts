export function makeTwoDigits(num: any) {
    num = String(num);

    return num.length === 1
        ? '0' + num
        : num.length > 2
        ? num.substring(0, 2)
        : num;
}
