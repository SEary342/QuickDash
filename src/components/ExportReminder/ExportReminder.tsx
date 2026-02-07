import { mdiAlertCircleOutline, mdiClose, mdiExport } from '@mdi/js'
import Icon from '@mdi/react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'

import { exportConfig } from '@comp/ExportUtils'

const ExportReminder = () => {
  const linkPages = useSelector((state: RootState) => state.linkPages)

  const [isDismissedSession, setIsDismissedSession] = useState(false)

  const hasCookie = Cookies.get('last_export_reminder') === 'true'

  const shouldShow = linkPages.length > 0 && !hasCookie && !isDismissedSession

  const handleDismiss = (days: number) => {
    Cookies.set('last_export_reminder', 'true', { expires: days, path: '/', sameSite: 'strict' })

    // Update local state to hide it immediately without waiting for a cookie re-read
    setIsDismissedSession(true)
  }

  const handleShortDismiss = () => {
    handleDismiss(1)
  }

  const handleExportAndDismiss = () => {
    exportConfig('QuickDashConfig', '.QDconfig', linkPages)
    handleDismiss(30)
  }

  // Early return if derived logic says no
  if (!shouldShow) return null

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border border-slate-700 text-white p-5 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="bg-amber-500/10 p-2 rounded-lg">
          <Icon path={mdiAlertCircleOutline} size={1} className="text-amber-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">Backup your data</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            You have {linkPages.length} page{linkPages.length > 1 ? 's' : ''} configured. Export a
            backup to avoid losing them if your browser cache is cleared.
          </p>
        </div>
        <button
          onClick={handleShortDismiss}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <Icon path={mdiClose} size={0.7} />
        </button>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleShortDismiss}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          Remind me later
        </button>
        <button
          onClick={handleExportAndDismiss}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95"
        >
          <Icon path={mdiExport} size={0.6} />
          Export
        </button>
      </div>
    </div>
  )
}

export default ExportReminder
