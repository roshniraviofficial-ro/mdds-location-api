import { useState } from 'react'
import { Database, ChevronLeft, ChevronRight } from 'lucide-react'

export function VillageBrowser() {
  const [pageSize, setPageSize] = useState(500)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedState, setSelectedState] = useState('Tamil Nadu')

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Village Master Data Browser
          </h3>
          <p className="text-slate-400 text-xs">Explore and verify full-scale dataset entries across India.</p>
        </div>

        {/* Page Size Config */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white focus:outline-none"
          >
            <option value={500}>500</option>
            <option value={5000}>5,000</option>
            <option value={10000}>10,000</option>
          </select>
        </div>
      </div>

      {/* Dependent Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">State (Required Filter)</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-lg p-2 focus:outline-none"
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">District (Dependent)</label>
          <select className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-lg p-2 focus:outline-none">
            <option value="Madurai">Madurai</option>
            <option value="Dindigul">Dindigul</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Sub-district (Dependent)</label>
          <select className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-lg p-2 focus:outline-none">
            <option value="Vadipatti">Vadipatti</option>
            <option value="Melur">Melur</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-700 pt-4 text-xs text-slate-400">
        <div>Showing Page <strong>{currentPage}</strong> of <strong>1,240</strong> (Total Records: 600,000+)</div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-1.5 bg-slate-900 border border-slate-700 rounded text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}