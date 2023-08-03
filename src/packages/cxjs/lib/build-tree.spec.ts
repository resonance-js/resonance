import { buildTree } from './build-tree';

const testCollection = [
    {
        name: 'Rickard Stark',
        parent: ''
    },
    {
        name: 'Eddard Stark',
        parent: 'Rickard Stark'
    },
    {
        name: 'Robb Stark',
        parent: 'Eddard Stark'
    },
    {
        name: 'Sansa Stark',
        parent: 'Eddard Stark'
    }
];
describe('Tree Builder', () => {
    test('Can build tree from flat dataset', () => {
        expect(
            buildTree(
                testCollection,
                'name',
                'parent',
                'children',
                'Rickard Stark',
                undefined
            )
        ).toEqual({
            name: 'Rickard Stark',
            parent: '',
            children: [
                {
                    name: 'Eddard Stark',
                    parent: 'Rickard Stark',
                    children: [
                        {
                            name: 'Robb Stark',
                            parent: 'Eddard Stark'
                        },
                        {
                            name: 'Sansa Stark',
                            parent: 'Eddard Stark'
                        }
                    ]
                }
            ]
        });
    });
});
