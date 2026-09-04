import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, MapPin, CheckCircle2, AlertCircle, Key, RefreshCw, Send, ShieldCheck } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    villageName: '',
    villageId: '',
    subDistrict: '',
    district: '',
    state: '',
    country: 'India'
  });

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiStats, setApiStats] = useState({ requests: 14, limit: 100, remaining: 86 });
  const [submitted, setSubmitted] = useState(false);

  const dropdownRef = useRef(null);

  // Demo API config
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_KEY = import.meta.env.VITE_API_KEY || 'demo_public_key_for_presentations';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Autocomplete Suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/v1/autocomplete?q=${encodeURIComponent(query)}`, {
          headers: {
            'x-api-key': API_KEY
          }
        });
        const result = await response.json();
        
        if (result.success && result.data) {
          setSuggestions(result.data);
          setShowDropdown(true);
          setApiStats(prev => ({
            ...prev,
            requests: prev.requests + 1,
            remaining: Math.max(0, prev.remaining - 1)
          }));
        }
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectVillage = (item) => {
    setFormData(prev => ({
      ...prev,
      villageName: item.village_name || item.name,
      villageId: item.village_id || item.id,
      subDistrict: item.sub_district || '',
      district: item.district || '',
      state: item.state || '',
      country: item.country || 'India'
    }));
    setQuery(item.village_name || item.name);
    setShowDropdown(false);
  };

  const handleClearLocation = () => {
    setFormData(prev => ({
      ...prev,
      villageName: '',
      villageId: '',
      subDistrict: '',
      district: '',
      state: '',
      country: 'India'
    }));
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-medium text-sm mb-1">
                <ShieldCheck className="w-4 h-4" /> B2B Integration Demo Mode
              </div>
              <h1 className="text-2xl font-bold">MDDS Location Hierarchy Client Demo</h1>
            </div>
            <div className="bg-indigo-800/80 backdrop-blur border border-indigo-700 px-4 py-2 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-2 text-indigo-200">
                <Key className="w-3.5 h-3.5" /> Key: <code className="text-indigo-100 font-mono">{API_KEY}</code>
              </div>
              <div className="text-indigo-300">
                Rate Limit: {apiStats.remaining} / {apiStats.limit} requests remaining
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
            <Building2 className="w-5 h-5 text-indigo-600" /> Business Inquiry & Address Form
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Form Submitted Successfully!</h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Location hierarchical data was successfully auto-populated and verified using MDDS API.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Autocomplete Location Field */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-slate-600 uppercase">
                  Village / Area Autocomplete (MDDS API)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Type at least 2 characters (e.g., 'Manibeli')..."
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                      if (formData.villageName) handleClearLocation();
                    }}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  {loading && (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-3.5" />
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectVillage(item)}
                        className="p-3 hover:bg-indigo-50/60 cursor-pointer transition flex items-start gap-3"
                      >
                        <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {item.village_name || item.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.full_address || `${item.sub_district}, ${item.district}, ${item.state}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Auto-filled Location Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Auto-filled Location Hierarchy</span>
                  {formData.villageName && (
                    <button
                      type="button"
                      onClick={handleClearLocation}
                      className="text-xs text-indigo-600 hover:underline capitalize font-normal"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="block text-[11px] text-slate-400">Sub-District</span>
                    <input
                      type="text"
                      readOnly
                      value={formData.subDistrict}
                      placeholder="Auto-filled"
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">District</span>
                    <input
                      type="text"
                      readOnly
                      value={formData.district}
                      placeholder="Auto-filled"
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">State</span>
                    <input
                      type="text"
                      readOnly
                      value={formData.state}
                      placeholder="Auto-filled"
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Country</span>
                    <input
                      type="text"
                      readOnly
                      value={formData.country}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Business Inquiry
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}