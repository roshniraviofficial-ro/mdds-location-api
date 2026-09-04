export interface StateData {
    state: string;
    count: number;
}

export interface ApiUsageData {
    date: string;
    requests: number;
}

export interface EndpointMetric {
    endpoint: string;
    requests: number;
}

export interface DashboardMetrics {
    totalVillages: number;
    activeUsers: number;
    totalRequests: number;
    avgResponseTimeMs: number;
}

export interface ApiKeyItem {
    id: string;
    name: string;
    keyMasked: string;
    createdAt: string;
    lastUsed: string;
    status: 'Active' | 'Revoked' | 'Expired';
}