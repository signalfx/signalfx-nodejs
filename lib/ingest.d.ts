// Definitions by: Vladimir Grenaderov <https://github.com/VladimirGrenaderov>
//                 Max Boguslavskiy <https://github.com/maxbogus>

export interface IngestOptions {
    enableAmazonUniqueId?: boolean | undefined;
    dimensions?: object | undefined;
    ingestEndpoint?: string | undefined;
    timeout?: number | undefined;
    batchSize?: number | undefined;
    userAgents?: string[] | undefined;
    proxy?: string | undefined;
}

export interface SignalMetric {
    metric: string;
    value: number;
    timestamp?: number | undefined;
    dimensions?: object | undefined;
}

export interface SignalReport {
    cumulative_counters?: SignalMetric[] | undefined;
    gauges?: SignalMetric[] | undefined;
    counters?: SignalMetric[] | undefined;
}

export class Ingest {
    constructor(token: string, options?: IngestOptions);
    send(report: SignalReport): Promise<void>;
}

export class IngestJson {
    constructor(token: string, options?: IngestOptions);
    send(report: SignalReport): Promise<void>;
}
