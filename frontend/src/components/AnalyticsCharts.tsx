import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import type { StateData, ApiUsageData } from '../types'

interface AnalyticsChartsProps {
  stateData: StateData[]
  usageData: ApiUsageData[]
}

export function AnalyticsCharts({ stateData, usageData }: AnalyticsChartsProps) {
  const safeStateData = stateData?.map((item) => ({
    state: item?.state || 'Unknown',
    count: item?.count ?? 0,
  })) || []

  const safeUsageData = usageData?.map((item) => ({
    date: item?.date || '',
    requests: item?.requests ?? 0,
  })) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Geographical Bar Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Entities by Top States</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeStateData}>
              <XAxis dataKey="state" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [Number(value || 0).toLocaleString(), 'Entities']}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* API Traffic Line Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly API Traffic Volume</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [Number(value || 0).toLocaleString(), 'Requests']}
              />
              <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}