export function buildTree<T>(
    collection: T[],
    parentKey: keyof T,
    childKey: keyof T,
    childrenKey: any,
    seed?: any,
    parent?: T
): T {
    if (seed !== undefined) {
        parent = collection.find((item) => item[parentKey] === seed);
    }

    const children = collection.filter((child) =>
        parent ? child[childKey] === parent[parentKey] : false
    );

    if (children.length > 0 && parent) {
        (parent as any)[childrenKey] = children;
        children.forEach((child) => {
            buildTree(
                collection,
                parentKey,
                childKey,
                childrenKey,
                undefined,
                child
            );
        });
    }

    return parent as T;
}
