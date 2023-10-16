const isNonNullable = (val: unknown): val is NonNullable<any> => {
    return val !== undefined && val !== null;
};
