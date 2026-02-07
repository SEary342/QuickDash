import { Icon } from '@mdi/react'

import Tooltip from '@comp/Tooltip'

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
  const iconSize = size !== undefined ? size : 0.9

  return (
    <Tooltip text={tooltipText} position={tooltipPosition} disabled={disabled}>
      <button
        className={`p-0.5 rounded-full flex flex-row transition-opacity ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={(e) => !disabled && onClick?.(e)}
        disabled={disabled}
      >
        <Icon path={path} size={iconSize} className={color} />
        {auxPath && <Icon path={auxPath} size={iconSize} className={color} />}
      </button>
    </Tooltip>
  )
}

export default IconBtn
