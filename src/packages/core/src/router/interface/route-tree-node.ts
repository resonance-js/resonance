import { SupportedHttpMethod } from '../../di/route';

export interface RouteTreeNode {
    httpMethod: SupportedHttpMethod;
    parameters: {
        [parameter: string]: string;
    };
}
