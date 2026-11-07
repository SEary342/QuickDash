import { mdiAlertCircleOutline, mdiClose, mdiExport } from '@mdi/js'
import { Icon } from '@mdi/react'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'

import { exportConfig } from '@comp/ExportUtils'

const ExportReminder = () => {
  const linkPages = useSelector((state: RootState) => state.linkPages)

  const [isDismissedSession, setIsDismissedSession] = useState(false)
  const [cookieConsentDays, setCookieConsentDays] = useState<number | null>(null)

  const hasCookie = Cookies.get('last_export_reminder') === 'true'

  const shouldShow = linkPages.length > 0 && !hasCookie && !isDismissedSession

  const requestCookieConsent = (days: number) => {
    setCookieConsentDays(days)
  }

  const handleCookieConsent = (accepted: boolean) => {
    if (accepted && cookieConsentDays !== null) {
      Cookies.set('last_export_reminder', 'true', {
        expires: cookieConsentDays,
        path: '/',
        sameSite: 'strict',
      })
    }

    setIsDismissedSession(true)
    setCookieConsentDays(null)
  }

  const handleShortDismiss = () => {
    requestCookieConsent(1)
  }

  const handleExportAndDismiss = () => {
    exportConfig('QuickDashConfig', '.QDconfig', linkPages)
    requestCookieConsent(30)
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
          aria-label="Dismiss reminder"
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

      {cookieConsentDays !== null && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
              <h3 id="cookie-consent-title" className="text-lg font-semibold">
                Allow a reminder cookie?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                QuickDash can save a cookie to remember that you dismissed this backup reminder. If
                you decline, the reminder will return the next time you reload.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => handleCookieConsent(false)}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleCookieConsent(true)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold transition-colors hover:bg-indigo-500"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportReminder
