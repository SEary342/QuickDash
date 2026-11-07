import { mdiChevronDown } from '@mdi/js'
import { Icon } from '@mdi/react'
import { useMemo, useState } from 'react'

import { getColorLookup } from '@src/types/colors'
import { iconTranslation } from '@src/types/icons'

type SelectOption = {
  value: string
  label: string
  color: boolean
  icon: boolean
}

type SelectWithLabelProps = {
  id: string
  value?: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  searchable?: boolean
  children: React.ReactNode
}

const SelectWithLabel = ({
  id,
  value,
  options,
  onChange,
  className,
  searchable = false,
  children,
}: SelectWithLabelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    return query
      ? options.filter((option) => option.label.toLocaleLowerCase().includes(query))
      : options
  }, [options, searchQuery])

  return (
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={id}
        className="absolute left-3 top-1 text-gray-500 dark:text-gray-400 text-sm"
      >
        {children}
      </label>
      <div
        className="peer w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 pt-6 pb-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.color && (
            <div
              className={`w-4 h-4 rounded ${getColorLookup(selectedOption.value).background}`}
            ></div>
          )}
          {selectedOption?.icon && iconTranslation[selectedOption.value] && (
            <Icon path={iconTranslation[selectedOption.value]} size={1} />
          )}
          <span>{selectedOption?.label || 'Select an option'}</span>
        </div>
        <Icon path={mdiChevronDown} size={1} className="text-gray-500 dark:text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto">
          {searchable && (
            <div className="sticky top-0 bg-white dark:bg-gray-700 p-2">
              <input
                type="search"
                aria-label={`Search ${children}`}
                placeholder="Search..."
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setIsOpen(false)
                    setSearchQuery('')
                  }
                }}
                className="w-full rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 px-2 py-1 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
                setSearchQuery('')
              }}
            >
              {option.color && (
                <div className={`w-4 h-4 rounded ${getColorLookup(option.value).background}`}></div>
              )}
              {option.icon && iconTranslation[option.value] && (
                <Icon path={iconTranslation[option.value]} size={1} />
              )}
              <span>{option.label}</span>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">No matches found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SelectWithLabel
