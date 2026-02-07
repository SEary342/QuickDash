/**
 * Overview
 * This file defines the AppBar React component, which serves as the
 * top navigation header for the QuickDash application. It handles global
 * application settings, configuration management (import/export), and
 * layout adjustments.
 *
 */
import { mdiChevronDown, mdiCog, mdiExport, mdiImport, mdiMinus, mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState, setFontSize, setNumberOfColumns } from '@src/store/store'
import { LinkPage } from '@src/types/linkPage'

import ExportReminder from '@comp/ExportReminder'
import { exportConfig } from '@comp/ExportUtils'
import FileImportDialog from '@comp/FileImportDialog'
import IconBtn from '@comp/IconBtn'

// Constants used by the settings bar to constrain increase / decrease column feature
const colMax = 6
const colMin = 1
const fontMin = 12
const fontMax = 24

/**
 * The AppBar function is the main React component for the application's
 * top navigation bar. It acts as a container for the application branding
 * and a controller for global settings.
 * @param linkPages  Current Dashboard Configuration
 * @returns div with branding, triggers and dropdown menu
 */
const AppBar = ({ linkPages }: { linkPages: LinkPage[] }) => {
  const dispatch = useDispatch() //Used to send actions (like changing column count) to the Redux store.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) //  Toggles the visibility of the settings menu.
  const [importOpen, setImportOpen] = useState(false) // Toggles the visibility of the "Import File" dialog.
  const columns = useSelector((state: RootState) => state.app.numberOfColumns) // Subscribes to the numberOfColumns state from the store.
  const appVersion = import.meta.env.APP_VERSION
  const fontSize = useSelector((state: RootState) => state.app.fontSize) // Select font size

  /**
   * Created to access the DOM elements directly, which is necessary for detecting clicks outside the menu.
   */
  const appBarRef = useRef<HTMLDivElement | null>(null)
  /**
   * created to access the DOM elements directly, which is necessary for detecting clicks outside the menu.
   */
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  /**
   * Ensures the column add actions stay within the defined column limits
   */
  const handleColumnIncrease = () => {
    if (columns < colMax) dispatch(setNumberOfColumns(columns + 1))
  }
  /**
   *  Ensures the column remove actions stay within the defined column min
   */
  const handleColumnDecrease = () => {
    if (columns > colMin) dispatch(setNumberOfColumns(columns - 1))
  }

  const handleFontIncrease = () => {
    if (fontSize < fontMax) dispatch(setFontSize(fontSize + 1))
  }

  const handleFontDecrease = () => {
    if (fontSize > fontMin) dispatch(setFontSize(fontSize - 1))
  }
  /**
   * Calls Export config to download the current config as a .QDConfig
   * and closes menu
   */
  const handleExport = () => {
    exportConfig('QuickDashConfig', '.QDconfig', linkPages)
    setIsDropdownOpen(false)
  }
  /**
   * Closes menu if user clicks outside dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        appBarRef.current &&
        !appBarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Apply font size to the root element whenever it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  return (
    <div ref={appBarRef} className="relative flex flex-row items-center bg-slate-800 p-2 shadow-xl">
      <img
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%237f00ff'/><text x='50' y='50' dy='.35em' font-family='sans-serif' font-weight='bold' font-size='50' fill='white' text-anchor='middle'>QD</text></svg>"
        alt="QuickDash Logo"
        className="w-12 h-12"
      />
      {/* Title Banner */}
      <span className="ml-3 text-2xl font-bold text-white">QuickDash</span>

      {/* --------------- Settings Button -------------- */}
      <IconBtn
        path={mdiCog}
        auxPath={mdiChevronDown}
        tooltipText="Settings"
        color="text-white"
        className="ml-auto hover:bg-slate-600"
        tooltipPosition="left"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 w-48 bg-white text-black rounded-lg shadow-lg p-3 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }} // time for the drop down to open
        >
          {/** This code block defines the content of the Settings Dropdown Menu
           * and the instantiation of the Import Dialog. It provides the user
           * interface for exporting data, adjusting the dashboard layout (columns),
           * accessing help, viewing version information, and handling the file import modal.
           * */}
          <div className="space-y-2">
            <button
              onClick={() => setImportOpen(true)}
              className="w-full text-left p-2 hover:bg-gray-200 rounded flex flex-row cursor-pointer"
            >
              <Icon path={mdiImport} size={1} className="mr-2" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="w-full text-left p-2 hover:bg-gray-200 rounded flex flex-row cursor-pointer"
            >
              <Icon path={mdiExport} size={1} className="mr-2" /> Export
            </button>
            {/**  ------------------- Column Area ---------------- */}
            <hr className="border-gray-200" />
            <div className="px-2">
              <p className="text-sm font-semibold text-gray-500">Columns</p>
              <div className="flex items-center space-x-2 w-full text-left py-1">
                <IconBtn
                  path={mdiMinus}
                  size={1}
                  onClick={handleColumnDecrease}
                  tooltipText="Decrease Columns"
                  color="text-black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={columns <= colMin}
                />
                <span className="text-lg font-semibold">{columns}</span>
                <IconBtn
                  path={mdiPlus}
                  size={1}
                  onClick={handleColumnIncrease}
                  tooltipText="Increase Columns"
                  color="text-black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={columns >= colMax}
                />
              </div>
            </div>
            {/**  ------------------- Font Area ---------------- */}
            <hr className="border-gray-200" />
            <div className="px-2">
              <p className="text-sm font-semibold text-gray-500">Font Size</p>
              <div className="flex items-center space-x-2 w-full text-left py-1">
                <IconBtn
                  path={mdiMinus}
                  size={0.8}
                  onClick={handleFontDecrease}
                  tooltipText="Smaller Text"
                  color="text-black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={fontSize <= fontMin}
                />
                <span className="text-lg font-semibold w-6 text-center">{fontSize}</span>
                <IconBtn
                  path={mdiPlus}
                  size={0.8}
                  onClick={handleFontIncrease}
                  tooltipText="Larger Text"
                  color="text-black"
                  className="bg-gray-200 rounded hover:bg-gray-300"
                  disabled={fontSize >= fontMax}
                />
              </div>
            </div>
            {/**  ------------------- Help Area ---------------- */}
            <hr className="border-gray-200" />
            <a
              href="https://github.com/SEary342/QuickDash/issues"
              className="block w-full text-left p-2 hover:bg-gray-200 rounded"
              target="_blank"
              rel="noreferrer"
            >
              Help
            </a>
            {/**  ------------------- Version Area ---------------- */}
            <hr className="border-gray-200" />
            <div className="w-full text-left p-2">
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                App Version
              </span>
              <p className="text-sm text-gray-600">{appVersion}</p>
            </div>
          </div>
        </motion.div>
      )}
      {/**  ------------------- Import Area ----------------*/}
      <FileImportDialog
        isOpen={importOpen}
        onClose={() => {
          setImportOpen(false)
          setIsDropdownOpen(false)
        }}
      />
      <ExportReminder />
    </div>
  )
}

export default AppBar
