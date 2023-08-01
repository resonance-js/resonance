export const GetMetadataKey = 'resonance:get';

export function Get(...path: string[]) {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        console.log('path', path); // the helloing path
        console.log('key', key); // function name
        console.log('target', target); // { test: 'doneky'}
        console.log('descriptor', descriptor); // [Function: doneky]
        console.log('constructor', target.prototype)
        Reflect.defineMetadata(
            GetMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}
