interface Breed {
    name: string;
    primaryColor: string;
    secondaryColor?: string;
    coat: 'fur' | 'hair';
    averageHeight?: number;
    averageWeight?: number;
}