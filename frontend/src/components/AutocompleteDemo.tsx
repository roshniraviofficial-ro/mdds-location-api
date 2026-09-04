import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { ExportData } from './ExportData'

const mockSearchData = [
  { id: '1', village: 'Manibeli', subDistrict: 'Akkalkuwa', district: 'Nandurbar', state: 'Maharashtra', pincode: '425419' },
  { id: '2', village: 'Madurai East', subDistrict: 'Madurai North', district: 'Madurai', state: 'Tamil Nadu', pincode: '625020' },
  { id: '3', village: 'Alanganallur', subDistrict: 'Vadipatti', district: 'Madurai', state: 'Tamil Nadu', pincode: '625501' },
  { id: '4', village: 'Melur', subDistrict: 'Melur', district: 'Madurai', state: 'Tamil Nadu', pincode: '625106' },
]

export function AutocompleteDemo() {
  const [query, setQuery] = useState('')
  
  const filteredResults = mockSearchData.filter(item => 
    item.village.toLowerCase().includes(query.toLowerCase()) ||
    item.district.toLowerCase().includes(query.toLowerCase()) ||
    item.state.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            Live Hierarchy Search & Export
          </h3>
          <p className="text-slate-400 text-xs mt-1">Search village locations and download matching dataset instantly.</p>
        </div>

        {/* Data Export Component */}
        <ExportData data={filteredResults} filename="location_hierarchy_export" />
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Village, District, or State (e.g. Madurai)..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Village Name</th>
              <th className="py-2.5 px-3">Sub-District</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3">Pincode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredResults.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/30">
                <td className="py-2.5 px-3 font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {item.village}
                </td>
                <td className="py-2.5 px-3">{item.subDistrict}</td>
                <td className="py-2.5 px-3">{item.district}</td>
                <td className="py-2.5 px-3 text-indigo-300">{item.state}</td>
                <td className="py-2.5 px-3 font-mono text-xs text-slate-400">{item.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}