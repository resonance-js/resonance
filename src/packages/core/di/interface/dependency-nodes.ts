import { Class } from '../../interface/class';

export type DependencyTree = Record<string, DependencyNode>;

export interface DependencyNode {
    class: Class;
    dependencies: string[];
    instance?: Class;
}
