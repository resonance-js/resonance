import { Class } from '../../interface/class';

export type DependencyTree = Record<string, DependencyNode>;

export interface DependencyNode {
    class: Class;
    className: string;
    dependencies: string[];
    instance?: Class;
}
