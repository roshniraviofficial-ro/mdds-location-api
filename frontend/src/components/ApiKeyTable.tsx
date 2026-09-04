import { useState } from 'react'
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react'

interface ApiKeyItem {
  id: string
  name: string
  key: string
  created: string
  status: 'Active' | 'Revoked'
}

export function ApiKeyTable() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: '1', name: 'Production Client', key: 'mdds_live_98a72b1c4d', created: '2026-08-15', status: 'Active' },
    { id: '2', name: 'Testing Sandbox', key: 'mdds_test_1a2b3c4d5e', created: '2026-08-20', status: 'Active' },
  ])
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Create New API Key Action
  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    const newEntry: ApiKeyItem = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `mdds_live_${Math.random().toString(36).substring(2, 12)}`,
      created: new Date().toISOString().split('T')[0],
      status: 'Active',
    }

    setApiKeys([...apiKeys, newEntry])
    setNewKeyName('')
    setIsModalOpen(false)
  }

  // Revoke API Key Action
  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k))
  }

  // Copy API Key to Clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">API Key Management</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Key
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">Key Name</th>
              <th className="py-3 px-4">API Token</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {apiKeys.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/30">
                <td className="py-3.5 px-4 font-medium text-white">{item.name}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-indigo-300">
                  {item.key}
                </td>
                <td className="py-3.5 px-4 text-slate-400">{item.created}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(item.id, item.key)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      title="Copy Key"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {item.status === 'Active' && (
                      <button
                        onClick={() => handleRevokeKey(item.id)}
                        className="p-1.5 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating New API Key */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-lg font-semibold text-white mb-2">Generate New API Key</h4>
            <p className="text-slate-400 text-xs mb-4">Enter a name for your application key to track usage.</p>
            
            <form onSubmit={handleCreateKey}>
              <div className="mb-4">
                <label className="block text-slate-300 text-sm font-medium mb-1">Key Name / Client Identifier</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., E-commerce Checkout App"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}