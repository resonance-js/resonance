export interface ResonanceConfig {
    port: number;
    hostname?: string;
    backlog?: number;
    credentials?: {
        key: string;
        cert: string;
    };
}
