import { DependencyNode } from './dependency-nodes';

export interface RoutesNode extends DependencyNode {
    route: string;
}
