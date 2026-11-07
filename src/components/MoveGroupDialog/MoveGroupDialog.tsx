import { useState } from 'react'
import { useSelector } from 'react-redux'

import { MoveGroupDestination, RootState } from '@src/store/store'
import { LinkGroup } from '@src/types/linkGroup'

import Dialog from '@comp/Dialog'
import MoveDestinationTab from '@comp/MoveDestinationTab'
import { hasDuplicatePageName, NEW_PAGE } from '@comp/MoveDestinationTab/moveDestinationUtils'

const normalize = (value: string) => value.trim().toLocaleLowerCase()

const MoveGroupDialog = ({
  isOpen,
  sourcePageIndex,
  group,
  onClose,
}: {
  isOpen: boolean
  sourcePageIndex: number
  group: LinkGroup
  onClose: (destination?: MoveGroupDestination, destinationPageName?: string) => void
}) => {
  const linkPages = useSelector((state: RootState) => state.linkPages)
  const [pageSelection, setPageSelection] = useState(String(sourcePageIndex))
  const [newPageName, setNewPageName] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isNewPage = pageSelection === NEW_PAGE
  const destinationPageIndex = isNewPage ? -1 : Number(pageSelection)
  const destinationPage = isNewPage ? undefined : linkPages[destinationPageIndex]
  const samePage = !isNewPage && destinationPageIndex === sourcePageIndex
  const duplicateGroupName =
    !isNewPage &&
    !samePage &&
    destinationPage?.groupList.some((item) => normalize(item.name) === normalize(group.name))
  const duplicatePageName = isNewPage && hasDuplicatePageName(linkPages, newPageName)

  const disabled = isNewPage
    ? !newPageName.trim() || duplicatePageName
    : !destinationPage || samePage || duplicateGroupName

  const handleConfirm = (confirm: boolean) => {
    if (!confirm || disabled) {
      onClose()
      return
    }

    if (isNewPage) {
      const pageName = newPageName.trim()
      onClose({ type: 'new-page', pageName }, pageName)
      return
    }

    if (!destinationPage) {
      onClose()
      return
    }

    onClose({ type: 'existing', pageIndex: destinationPageIndex }, destinationPage.name)
  }

  return (
    <Dialog
      title={`Move "${group.name}"`}
      isOpen={isOpen}
      onClose={handleConfirm}
      disableConfirm={disabled}
    >
      <div className="space-y-3">
        <MoveDestinationTab
          idPrefix="move-group"
          pages={linkPages}
          pageSelection={pageSelection}
          onPageChange={setPageSelection}
          newPageName={newPageName}
          onNewPageNameChange={setNewPageName}
          dropdownOpen={dropdownOpen}
          onDropdownOpenChange={setDropdownOpen}
        />

        {samePage && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a different tab to move this group.
          </p>
        )}
        {duplicateGroupName && (
          <p className="text-sm text-red-500">
            A group named &quot;{group.name}&quot; already exists in this tab.
          </p>
        )}
      </div>
    </Dialog>
  )
}

export default MoveGroupDialog
