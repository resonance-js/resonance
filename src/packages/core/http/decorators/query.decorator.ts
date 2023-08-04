export function Query(query: string) {
    return (target: any, fnKey: string, parameterIndex: number) => {
        if (!target.mapping) {
            target.mapping = {};
        }

        if (!target.mapping[fnKey]) {
            target.mapping[fnKey] = [];
        }

        target.mapping[fnKey].push({
            name: query,
            index: parameterIndex,
            type: 'query',
        });
    };
}
