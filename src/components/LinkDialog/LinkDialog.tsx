import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@src/store/store'
import { colorOptionsArray } from '@src/types/colors'
import { iconOptionsArray } from '@src/types/icons'
import { LinkData } from '@src/types/linkData'

import ConfirmDialog from '@comp/ConfirmDialog'
import Dialog from '@comp/Dialog'
import InputWithLabel from '@comp/InputWithLabel'
import Link from '@comp/Link'
import SelectWithLabel from '@comp/SelectWithLabel'

const validUrl = (v: string) => {
  let url
  try {
    url = new URL(v)
  } catch {
    return 'URL is not valid'
  }
  return ['http:', 'https:'].includes(url.protocol) || 'URL protocol not valid'
}

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

const LinkDialog = ({
  pageId,
  panelId,
  isOpen,
  editMode = false,
  link = { text: '', url: '', color: '', outline: false, icon: '', description: '' },
  onClose,
}: {
  pageId: number
  panelId: number
  isOpen: boolean
  editMode: boolean
  link?: LinkData
  onClose: (link?: LinkData, remove?: boolean) => void
}) => {
  const [formData, setFormData] = useState<LinkData>({ ...link })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const linkPages = useSelector((state: RootState) => state.linkPages)

  const existingNames = useMemo(() => {
    return (
      linkPages[pageId]?.groupList[panelId]?.linkList.map((lnk) => lnk.text.trim().toLowerCase()) ||
      []
    )
  }, [linkPages, pageId, panelId])

  const urlValid = validUrl(formData.url)
  const isDuplicate =
    formData.text.trim().toLowerCase() !== link.text.trim().toLowerCase() &&
    existingNames.includes(formData.text.trim().toLowerCase())

  const showUrlError = formData.url.length > 0 && urlValid !== true
  const showDuplicateError = formData.text.length > 0 && isDuplicate

  const hasChanged =
    formData.text !== link.text ||
    formData.url !== link.url ||
    formData.description !== link.description ||
    formData.color !== link.color ||
    formData.outline !== link.outline ||
    formData.icon !== link.icon

  const handleClose = (confirm: boolean) => {
    if (!confirm) {
      onClose(undefined)
    } else {
      onClose(
        { ...formData, text: formData.text.trim(), description: formData.description?.trim() },
        false,
      )
    }
  }

  return (
    <Dialog
      title={editMode ? 'Edit Link' : 'Add Link'}
      isOpen={isOpen}
      onClose={handleClose}
      disableConfirm={
        !formData.text ||
        !formData.url ||
        urlValid !== true ||
        isDuplicate ||
        (editMode && !hasChanged)
      }
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
        message="Delete this Link?"
        onConfirm={(confirmed) => {
          setConfirmOpen(false)
          if (confirmed) {
            onClose(link, true)
          }
        }}
      />

      <InputWithLabel
        id="linkName"
        hasError={showDuplicateError}
        value={formData.text}
        onInputChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
        className="my-2"
      >
        Link Name
      </InputWithLabel>

      <InputWithLabel
        errorText={showUrlError ? (urlValid as string) : undefined}
        hasError={showUrlError}
        id="linkUrl"
        value={formData.url}
        onInputChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
        className="my-2"
      >
        Link URL
      </InputWithLabel>

      <InputWithLabel
        id="linkDescription"
        value={formData.description || ''}
        onInputChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        className="my-2"
      >
        Description
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

      <div className="flex items-center my-2">
        <input
          id="outlined"
          type="checkbox"
          checked={formData.outline}
          onChange={(e) => setFormData((prev) => ({ ...prev, outline: e.target.checked }))}
          className="mr-2 cursor-pointer"
        />
        <label htmlFor="outlined" className="cursor-pointer select-none text-sm font-semibold">
          Outlined
        </label>
      </div>

      <div className="mt-4 p-4 border rounded bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Preview:</p>
        <Link pageId={-1} panelId={-1} id={-1} item={formData} />
      </div>
    </Dialog>
  )
}

export default LinkDialog
