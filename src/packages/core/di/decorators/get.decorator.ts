export const GetMetadataKey = 'resonance:get';

export function Get(...path: string[]) {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        // Reflect.defineMetadata(
        //     ''
        // )
        console.log('path', path); // the helloing path
        console.log('key', key); // function name
        console.log('target', target); // { test: 'doneky'}
        console.log('descriptor', descriptor.value); // [Function: doneky]

        // This returns the function!!!
        console.log(descriptor.value());

        Reflect.defineMetadata(
            GetMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}

export function logParam(
    target: any,
    methodKey: string,
    parameterIndex: number
): any {
    console.log(target);
    // console.log(methodKey);
    // console.log(parameterIndex);
    target.test = methodKey;
}
