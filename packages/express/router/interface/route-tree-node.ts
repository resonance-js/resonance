import { AuthLifecycleFns } from '../../auth';
import { SupportedHttpMethod } from '../../di/route';

export interface RouteTreeNode {
    httpMethod: SupportedHttpMethod;
    authGuard?: keyof AuthLifecycleFns;
    metadataKey: string;
    path: string;
    parameters: {
        [paramName: string]: string;
    };
}
