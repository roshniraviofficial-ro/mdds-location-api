import { useState } from 'react'
import { AutocompleteDemo } from './components/AutocompleteDemo'
import { Register } from './components/Register'
import { ApiLogsViewer } from './components/ApiLogsViewer'
import { VillageBrowser } from './components/VillageBrowser'
import { B2BDemoForm } from './components/B2BDemoForm'

export default function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'b2bform' | 'register' | 'logs' | 'browser'>('demo')

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-indigo-400">MDDS Location Hierarchy Portal</h1>
          <p className="text-slate-400 text-xs">Enterprise Location Data Engine & Management System</p>
        </div>

        <nav className="flex gap-2">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'demo' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Live Search & Analytics
          </button>
          <button
            onClick={() => setActiveTab('b2bform')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'b2bform' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            B2B Form Demo
          </button>
          <button
            onClick={() => setActiveTab('browser')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'browser' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Master Data Browser
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            API Logs
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            B2B Self-Registration
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeTab === 'demo' && <AutocompleteDemo />}
        {activeTab === 'b2bform' && <B2BDemoForm />}
        {activeTab === 'browser' && <VillageBrowser />}
        {activeTab === 'logs' && <ApiLogsViewer />}
        {activeTab === 'register' && <Register />}
      </main>
    </div>
  )
}