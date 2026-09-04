import React, { useState } from 'react'
import { Building2, Mail, Phone, Lock, FileText, CheckCircle } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    businessEmail: '',
    companyName: '',
    phone: '',
    gstNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Business Email Validation (No free email providers)
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    const domain = formData.businessEmail.split('@')[1]?.toLowerCase()
    
    if (freeDomains.includes(domain)) {
      setError('Please use a valid business/corporate email address (e.g., name@company.com).')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Account Created as PENDING_APPROVAL
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-800 border border-slate-700 p-8 rounded-xl text-center">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Registration Submitted</h3>
        <p className="text-slate-300 text-sm mb-4">
          Your account status is currently <span className="text-amber-400 font-semibold">PENDING_APPROVAL</span>.
        </p>
        <p className="text-slate-400 text-xs">
          An email notification has been sent to the administrator for review. API Key generation will be enabled once approved.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto my-10 bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-2">B2B Account Registration</h2>
      <p className="text-slate-400 text-xs mb-6">Register your company to access MDDS Location APIs.</p>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Business Email</label>
          <div className="relative">
            <input
              type="email"
              name="businessEmail"
              required
              placeholder="name@company.com"
              value={formData.businessEmail}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Registered Business / Company Name</label>
          <div className="relative">
            <input
              type="text"
              name="companyName"
              required
              placeholder="Enterprise Pvt Ltd"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
            <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">GST Number (Optional)</label>
            <div className="relative">
              <input
                type="text"
                name="gstNumber"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}