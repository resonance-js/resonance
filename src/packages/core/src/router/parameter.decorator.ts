import { getFunctionParameters } from '../util';

export function Param(parameter: string, required?: boolean) {
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

        target.mapping[fnKey]['param'].push({
            name: parameter,
            index: parameterIndex,
            type: getFunctionParameters(target, fnKey)[parameterIndex],
            required: required ?? true,
        });
    };
}
