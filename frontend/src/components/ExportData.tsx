import { Download, FileSpreadsheet, FileJson } from 'lucide-react'

interface ExportDataProps {
  data: Record<string, unknown>[]
  filename?: string
}

export function ExportData({ data, filename = 'mdds_location_data' }: ExportDataProps) {
  // Export as CSV
  const exportToCSV = () => {
    if (!data || !data.length) return

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    )

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${filename}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export as JSON
  const exportToJSON = () => {
    if (!data || !data.length) return

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`
    const link = document.createElement('a')
    link.setAttribute('href', jsonString)
    link.setAttribute('download', `${filename}_${Date.now()}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
        <Download className="w-3.5 h-3.5" /> Export Data:
      </span>
      <button
        onClick={exportToCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        CSV
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors"
      >
        <FileJson className="w-3.5 h-3.5 text-amber-400" />
        JSON
      </button>
    </div>
  )
}