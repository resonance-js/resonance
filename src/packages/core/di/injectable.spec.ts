import { InjectableCatalog } from './catalogs';
import { Injectable, InjectableMetadataKey } from './injectable';

@Injectable()
class InjectableTest {
    constructor() {}
}

describe('Injectable', () => {
    const testInjectable = new InjectableTest();

    beforeAll(() => {
        const keys = Reflect.getMetadata(InjectableMetadataKey, testInjectable);
        console.log(keys);
        console.log(InjectableCatalog);
        expect(true).toEqual(true);
    });

    it('Should inject classname as metadata', () => {});
});
