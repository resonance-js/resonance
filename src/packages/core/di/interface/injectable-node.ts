import { DependencyNode } from './dependency-nodes';

export interface InjectableNode extends DependencyNode {
    providedIn: string;
    moduleName: string;
    export?: boolean;
}
