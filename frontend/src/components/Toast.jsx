// Toast — a temporary notification banner
// Props: message (string), type ('success' | 'error'), onClose

import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, 4000) // Auto-dismiss after 4s
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }

  return (
    <div className={`flex items-center justify-between border rounded-lg px-4 py-3 mb-5 text-sm font-medium shadow-sm ${styles[type]}`}>
      <span>{icons[type]} {message}</span>
      <button onClick={onClose} className="ml-4 text-lg leading-none opacity-60 hover:opacity-100">×</button>
    </div>
  )
}
