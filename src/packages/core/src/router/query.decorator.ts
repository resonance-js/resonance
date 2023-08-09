export function Query(query: string, required?: boolean) {
    return (target: any, fnKey: string, parameterIndex: number) => {
        if (!target.mapping) {
            target.mapping = {};
        }

        if (!target.mapping[fnKey]) {
            target.mapping[fnKey] = {
                param: [],
                query: [],
            };
        }

        target.mapping[fnKey]['query'].push({
            name: query,
            index: parameterIndex,
            required,
        });
    };
}
