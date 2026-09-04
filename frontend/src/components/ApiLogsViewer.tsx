import { useState } from 'react'
import { Activity, Download } from 'lucide-react'

const mockLogs = [
  { id: '1', timestamp: '2026-08-31 17:45:12', apiKey: 'ak_a1b2c3...678', business: 'Acme Corp', endpoint: '/api/v1/villages', responseTime: 120, status: 200, ip: '192.168.x.x' },
  { id: '2', timestamp: '2026-08-31 17:46:01', apiKey: 'ak_x9y8z7...123', business: 'DataWorks Ltd', endpoint: '/api/v1/districts', responseTime: 450, status: 200, ip: '10.0.x.x' },
  { id: '3', timestamp: '2026-08-31 17:48:30', apiKey: 'ak_a1b2c3...678', business: 'Acme Corp', endpoint: '/api/v1/states', responseTime: 890, status: 429, ip: '192.168.x.x' },
  { id: '4', timestamp: '2026-08-31 17:50:00', apiKey: 'ak_m5n6p7...890', business: 'Global Tech', endpoint: '/api/v1/villages/search', responseTime: 210, status: 500, ip: '172.16.x.x' },
]

export function ApiLogsViewer() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [endpointFilter, setEndpointFilter] = useState('ALL')

  const filteredLogs = mockLogs.filter(log => {
    const matchStatus = statusFilter === 'ALL' || 
      (statusFilter === '2xx' && log.status >= 200 && log.status < 300) ||
      (statusFilter === '4xx' && log.status >= 400 && log.status < 500) ||
      (statusFilter === '5xx' && log.status >= 500)
    const matchEndpoint = endpointFilter === 'ALL' || log.endpoint.includes(endpointFilter)
    return matchStatus && matchEndpoint
  })

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            API Request Logs Viewer
          </h3>
          <p className="text-slate-400 text-xs">Monitor real-time status, latency, and system response codes.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={endpointFilter}
            onChange={(e) => setEndpointFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Endpoints</option>
            <option value="/villages">/villages</option>
            <option value="/districts">/districts</option>
            <option value="/states">/states</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Status Codes</option>
            <option value="2xx">2xx (Success)</option>
            <option value="4xx">4xx (Rate Limit / Auth Failure)</option>
            <option value="5xx">5xx (Server Error)</option>
          </select>

          <button className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg">
            <Download className="w-3.5 h-3.5" /> Export Logs
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">API Key (Masked)</th>
              <th className="py-2.5 px-3">Business</th>
              <th className="py-2.5 px-3">Endpoint</th>
              <th className="py-2.5 px-3">Latency</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 font-mono text-xs">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-700/20">
                <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                <td className="py-2.5 px-3 text-slate-300">{log.apiKey}</td>
                <td className="py-2.5 px-3 text-indigo-300 font-sans">{log.business}</td>
                <td className="py-2.5 px-3 text-slate-200">{log.endpoint}</td>
                <td className="py-2.5 px-3">{log.responseTime} ms</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status < 300 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    log.status < 500 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}