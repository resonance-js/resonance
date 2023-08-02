// import { NcLogger } from '../../log';

export const GetMetadataKey = 'resonance:get';

// const console = new NcLogger('GetDecorator')

export function Get(...path: string[]) {
    return function (
        // @ts-ignore
        target: any,
        // @ts-ignore
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        // console.debug('path', path); // the helloing path
        // console.debug('key', key); // function name
        // console.debug('target', target); // { test: 'doneky'}
        // console.debug('descriptor', descriptor); // [Function: doneky]
        // console.debug('constructor', target.prototype)
        Reflect.defineMetadata(
            GetMetadataKey,
            path.join('/'),
            descriptor.value
        );
        return descriptor;
    };
}
