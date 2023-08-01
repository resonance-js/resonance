export class Catalog<T> extends Map<string, T> {}

export const RoutesCatalog = new Catalog();

export const RootInjectableStore = new Catalog();

// We need to get this working
export const GetEndpointsCatalog = new Catalog<{
    function: any;
    endpont: string;
}>();
