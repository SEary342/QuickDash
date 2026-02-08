import {
  DOMAttributes,
  ReactElement,
  Ref,
  cloneElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  text?: string
  children: ReactElement<DOMAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }>
  position?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}

const Tooltip = ({ text, children, position = 'top', disabled = false }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, transform: '' })
  const triggerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!showTooltip || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const padding = 8

      let top = 0
      let left = 0
      let transform = ''

      switch (position) {
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
  }, [showTooltip, position])

  return (
    <>
      {cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          if (!disabled && text) setShowTooltip(true)
          children.props.onMouseEnter?.(e)
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          setShowTooltip(false)
          children.props.onMouseLeave?.(e)
        },
      })}
      {showTooltip &&
        text &&
        createPortal(
          <div
            className="fixed px-2 py-1 bg-gray-800 text-white text-xs shadow-lg whitespace-nowrap rounded pointer-events-none z-9999"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.transform,
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  )
}

export default Tooltip
