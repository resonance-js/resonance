export function Param(
    parameter: string,
    opts?: {
        required?: boolean;
        type?: 'number' | 'array' | 'string' | 'boolean' | 'object' | 'date';
    }
) {
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

        console.log(Reflect.ownKeys(target[fnKey]));

        target.mapping[fnKey]['param'].push({
            name: parameter,
            index: parameterIndex,
            type: opts?.type ?? 'string',
            required: opts?.required ?? true,
        });
    };
}
