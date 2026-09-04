import { useQuery } from '@tanstack/react-query'
import { useDashboardStore } from '../store/useDashboardStore'
import { AnalyticsCharts } from '../components/AnalyticsCharts'
import { ApiKeyTable } from '../components/ApiKeyTable'
import { AutocompleteDemo } from '../components/AutocompleteDemo'
import { fetchDashboardMetrics, fetchStateDistribution } from '../services/api'
import type { StateData, ApiUsageData, DashboardMetrics } from '../types'
import { Database, Users, Activity, Clock, Filter, RefreshCw } from 'lucide-react'

const fallbackMetrics: DashboardMetrics = {
  totalVillages: 650000,
  activeUsers: 1420,
  totalRequests: 892100,
  avgResponseTimeMs: 42,
}

const fallbackStateData: StateData[] = [
  { state: 'Tamil Nadu', count: 15800 },
  { state: 'Kerala', count: 1450 },
  { state: 'Karnataka', count: 29300 },
  { state: 'Andhra Pradesh', count: 18100 },
  { state: 'Maharashtra', count: 43600 },
]

const mockUsageData: ApiUsageData[] = [
  { date: 'Mon', requests: 12000 },
  { date: 'Tue', requests: 19000 },
  { date: 'Wed', requests: 15000 },
  { date: 'Thu', requests: 22000 },
  { date: 'Fri', requests: 30000 },
  { date: 'Sat', requests: 25000 },
  { date: 'Sun', requests: 18000 },
]

export function Dashboard() {
  const { timeRange, setTimeRange } = useDashboardStore()

  const { data: metricsData, isLoading: isMetricsLoading, refetch } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 30000,
  })

  const { data: statesData } = useQuery({
    queryKey: ['stateDistribution'],
    queryFn: fetchStateDistribution,
    staleTime: 30000,
  })

  const metrics: DashboardMetrics = {
    totalVillages: metricsData?.totalVillages ?? fallbackMetrics.totalVillages,
    activeUsers: metricsData?.activeUsers ?? fallbackMetrics.activeUsers,
    totalRequests: metricsData?.totalRequests ?? fallbackMetrics.totalRequests,
    avgResponseTimeMs: metricsData?.avgResponseTimeMs ?? fallbackMetrics.avgResponseTimeMs,
  }
  
  const stateData: StateData[] = statesData || fallbackStateData

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">MDDS Location Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time API monitoring and geographical data distribution</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isMetricsLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Time Filter */}
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Entities</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {(metrics.totalVillages ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Active API Keys</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {(metrics.activeUsers ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total API Calls</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {(metrics.totalRequests ?? 0).toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Avg Latency</p>
            <h3 className="text-2xl font-bold text-white mt-1">{metrics.avgResponseTimeMs ?? 0} ms</h3>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsCharts stateData={stateData} usageData={mockUsageData} />

      {/* Autocomplete Demo Component */}
      <AutocompleteDemo />

      {/* API Key Management Table Section */}
      <ApiKeyTable />
    </div>
  )
}