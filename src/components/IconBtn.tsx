import { useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@mdi/react'

const IconBtn = ({
  className = '',
  path,
  auxPath,
  tooltipText,
  color,
  onClick,
  size,
  tooltipPosition = 'top',
  disabled = false,
}: {
  className?: string
  path: string
  auxPath?: string
  tooltipText: string
  color: string
  onClick?: (e: React.MouseEvent) => void
  size?: number
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, transform: '' })
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const iconSize = size !== undefined ? size : 0.9

  useLayoutEffect(() => {
    if (!showTooltip || !buttonRef.current) return

    const updatePosition = () => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const padding = 8

      let top = 0
      let left = 0
      let transform = ''

      switch (tooltipPosition) {
        case 'bottom':
          top = rect.bottom + padding
          left = rect.left + rect.width / 2
          transform = 'translateX(-50%)'
          break
        case 'left':
          top = rect.top + rect.height / 2
          left = rect.left - padding
          transform = 'translate(-100%, -50%)'
          break
        case 'right':
          top = rect.top + rect.height / 2
          left = rect.right + padding
          transform = 'translate(0, -50%)'
          break
        default: // top
          top = rect.top - padding
          left = rect.left + rect.width / 2
          transform = 'translate(-50%, -100%)'
      }

      setCoords({ top, left, transform })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [showTooltip, tooltipPosition]) // Dependencies are strictly what is needed

  return (
    <>
      <button
        ref={buttonRef}
        className={`p-0.5 rounded-full flex flex-row transition-opacity ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onMouseEnter={() => !disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => !disabled && onClick?.(e)}
        disabled={disabled}
      >
        <Icon path={path} size={iconSize} className={color} />
        {auxPath && <Icon path={auxPath} size={iconSize} className={color} />}
      </button>

      {showTooltip &&
        createPortal(
          <div
            className="fixed px-2 py-1 bg-gray-800 text-white text-xs shadow-lg whitespace-nowrap rounded pointer-events-none z-9999"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.transform,
            }}
          >
            {tooltipText}
          </div>,
          document.body,
        )}
    </>
  )
}

export default IconBtn
