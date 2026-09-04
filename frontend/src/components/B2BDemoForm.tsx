import React, { useState, useEffect } from 'react'
import { MapPin, User, Mail, Phone, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react'

interface VillageSuggestion {
  id: string
  village: string
  subDistrict: string
  district: string
  state: string
  displayLabel?: string
}

export function B2BDemoForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Address Auto-fill states
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<VillageSuggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [selectedAddress, setSelectedAddress] = useState({
    subDistrict: '',
    district: '',
    state: '',
    country: 'India'
  })

  const [submitted, setSubmitted] = useState(false)

  // API Integration Flow with 300ms Debounce
  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/v1/autocomplete?q=${encodeURIComponent(searchQuery)}`)
          const data = await response.json()
          if (data.success) {
            setSuggestions(data.data)
            setShowDropdown(true)
          } else {
            setSuggestions([])
          }
        } catch (err) {
          console.error('Failed to fetch autocomplete suggestions:', err)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
        setShowDropdown(false)
      }
    }

    const timer = setTimeout(() => {
      fetchAutocomplete()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectVillage = (item: VillageSuggestion) => {
    setSearchQuery(item.village)
    setSelectedAddress({
      subDistrict: item.subDistrict,
      district: item.district,
      state: item.state,
      country: 'India'
    })
    setShowDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-2xl mx-auto my-6 bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            B2B Client Contact Form Integration Demo
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Demonstrates MDDS Autocomplete API auto-filling full location hierarchy fields.
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded text-[11px] text-amber-400 flex items-center gap-1 font-mono">
          <ShieldAlert className="w-3.5 h-3.5" /> Demo Key: Read-Only (100 req/day)
        </div>
      </div>

      {submitted ? (
        <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-lg text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Form Submitted Successfully!</h3>
          <p className="text-slate-400 text-xs mb-4">Standardized full address payload captured:</p>
          <pre className="bg-slate-950 p-3 rounded text-left text-xs text-indigo-300 font-mono overflow-x-auto">
{JSON.stringify({
  fullName,
  email,
  phone,
  address: {
    village: searchQuery,
    subDistrict: selectedAddress.subDistrict,
    district: selectedAddress.district,
    state: selectedAddress.state,
    country: selectedAddress.country
  },
  message
}, null, 2)}
          </pre>
          <button 
            onClick={() => {
              setSubmitted(false)
              setSearchQuery('')
              setSelectedAddress({ subDistrict: '', district: '', state: '', country: 'India' })
            }}
            className="mt-4 px-4 py-1.5 bg-slate-800 text-slate-200 text-xs rounded hover:bg-slate-700 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Autocomplete Section */}
          <div className="border-t border-slate-700/60 pt-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
              Address Section (API Autocomplete Powered)
            </h4>

            {/* Village Input field */}
            <div className="relative mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Village / Area (Start typing min 2 characters)
              </label>
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type village name (e.g., Manibeli, Madurai)..."
                className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 mt-1 bg-slate-950 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-800">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectVillage(item)}
                      className="p-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors"
                    >
                      <strong className="font-semibold">{item.village}</strong>{' '}
                      <span className="opacity-75">
                        ({item.subDistrict}, {item.district}, {item.state})
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {isLoading && (
                <div className="absolute right-3 top-8 text-xs text-indigo-400">Loading...</div>
              )}
            </div>

            {/* Auto-filled Fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
              <div>
                <label className="block text-[10px] text-slate-400">Sub-District (Auto-filled)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAddress.subDistrict}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-indigo-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400">District (Auto-filled)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAddress.district}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-indigo-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400">State (Auto-filled)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAddress.state}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-indigo-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400">Country (Auto-filled)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAddress.country}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
            <div className="relative">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your inquiry..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            Submit Contact Form
          </button>
        </form>
      )}
    </div>
  )
}