import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'
import { colorOptionsArray } from '@src/types/colors'
import { iconOptionsArray } from '@src/types/icons'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import ConfirmDialog from '@comp/ConfirmDialog'
import Dialog from '@comp/Dialog'
import InputWithLabel from '@comp/InputWithLabel'
import SelectWithLabel from '@comp/SelectWithLabel'

const defaultDash: () => LinkPage = () => ({ name: '', groupList: [] })
const defaultGroup: () => LinkGroup = () => ({ name: '', linkList: [] })

const colorSelect = colorOptionsArray.map(({ title, label }) => ({
  value: label,
  label: title,
  color: true,
  icon: false,
}))

const iconSelect = iconOptionsArray.map(({ title, value }) => ({
  value,
  label: title,
  color: false,
  icon: true,
}))

const PanelDialog = ({
  isOpen,
  editMode = false,
  groupMode = false,
  linkPage = defaultDash(),
  linkGroup = defaultGroup(),
  pageId,
  onClose,
}: {
  isOpen: boolean
  editMode?: boolean
  groupMode?: boolean
  linkPage?: LinkPage
  linkGroup?: LinkGroup
  pageId?: number
  onClose: (linkPage?: LinkPage, linkGroup?: LinkGroup, remove?: boolean) => void
}) => {
  const dialogName = groupMode ? 'Group' : 'Dash'
  const initialData = groupMode ? linkGroup : linkPage

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    color: initialData.color || '',
    icon: initialData.icon || '',
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const linkPages = useSelector((state: RootState) => state.linkPages)

  const existingNames = useMemo(() => {
    const names: string[] = []

    if (pageId !== undefined && pageId >= 0 && linkPages[pageId] !== undefined) {
      linkPages[pageId].groupList.forEach((gp) => {
        if (gp.name !== linkGroup.name) {
          names.push(gp.name.toLowerCase())
        }
      })
    } else {
      linkPages.forEach((pg) => {
        if (pg.name !== linkPage.name) {
          names.push(pg.name.toLowerCase())
        }
      })
    }
    return names
  }, [linkPages, pageId, linkGroup.name, linkPage.name])

  const isDuplicate = existingNames.includes(formData.name.trim().toLowerCase())
  const nameExists = formData.name.trim().length > 0
  const hasChanged =
    formData.name !== initialData.name ||
    formData.color !== initialData.color ||
    formData.icon !== initialData.icon

  const handleClose = (confirm: boolean) => {
    if (!confirm) return onClose(undefined)

    // Pass back updated objects with the new form values
    onClose(
      groupMode ? linkPage : { ...linkPage, ...formData, name: formData.name.trim() },
      groupMode ? { ...linkGroup, ...formData, name: formData.name.trim() } : linkGroup,
      false,
    )
  }

  return (
    <Dialog
      title={editMode ? `Edit ${dialogName}` : `Add ${dialogName}`}
      isOpen={isOpen}
      onClose={handleClose}
      disableConfirm={!nameExists || isDuplicate || (editMode && !hasChanged)}
      actionButton={
        editMode
          ? {
              action: () => setConfirmOpen(true),
              text: 'Delete',
              color: 'bg-red-600 hover:bg-red-700 text-white',
            }
          : undefined
      }
    >
      <ConfirmDialog
        isOpen={confirmOpen}
        message={`Delete this ${dialogName}?`}
        onConfirm={(confirmed) => {
          setConfirmOpen(false)
          if (confirmed) {
            onClose(linkPage, linkGroup, true)
          }
        }}
      />
      <InputWithLabel
        id="dashGroupName"
        value={formData.name}
        type="text"
        onInputChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        className="my-2"
        hasError={isDuplicate}
      >
        {dialogName} Name
      </InputWithLabel>
      <SelectWithLabel
        id="color"
        value={formData.color}
        options={colorSelect}
        onChange={(val) => setFormData((prev) => ({ ...prev, color: val }))}
        className="my-2"
      >
        Color
      </SelectWithLabel>
      <SelectWithLabel
        id="icon"
        value={formData.icon}
        options={iconSelect}
        onChange={(val) => setFormData((prev) => ({ ...prev, icon: val }))}
        className="my-2"
      >
        Icon
      </SelectWithLabel>
    </Dialog>
  )
}

export default PanelDialog
