import { SupportedHttpMethod } from '../../di/route';

export interface RouteTreeNode {
    httpMethod: SupportedHttpMethod;
    metadataKey: string;
    path: string;
    parameters: {
        [paramName: string]: string;
    };
}
