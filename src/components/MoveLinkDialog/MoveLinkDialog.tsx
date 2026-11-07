import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState, MoveLinkDestination } from '@src/store/store'
import { LinkData } from '@src/types/linkData'

import Dialog from '@comp/Dialog'
import MoveDestinationTab from '@comp/MoveDestinationTab'
import { hasDuplicatePageName, NEW_PAGE } from '@comp/MoveDestinationTab/moveDestinationUtils'
import SelectWithLabel from '@comp/SelectWithLabel'

const NEW_GROUP = 'new-group'

const normalize = (value: string) => value.trim().toLocaleLowerCase()

const MoveLinkDialog = ({
  isOpen,
  sourcePageIndex,
  sourceGroupIndex,
  link,
  onClose,
}: {
  isOpen: boolean
  sourcePageIndex: number
  sourceGroupIndex: number
  link: LinkData
  onClose: (destination?: MoveLinkDestination, destinationPageName?: string) => void
}) => {
  const linkPages = useSelector((state: RootState) => state.linkPages)
  const [pageSelection, setPageSelection] = useState(String(sourcePageIndex))
  const [groupSelection, setGroupSelection] = useState(String(sourceGroupIndex))
  const [newPageName, setNewPageName] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<'page' | 'group' | null>(null)

  const isNewPage = pageSelection === NEW_PAGE
  const selectedPageIndex = isNewPage ? -1 : Number(pageSelection)
  const selectedPage = isNewPage ? undefined : linkPages[selectedPageIndex]
  const isNewGroup = isNewPage || groupSelection === NEW_GROUP

  const duplicatePageName = isNewPage && hasDuplicatePageName(linkPages, newPageName)
  const duplicateGroupName =
    !isNewPage &&
    isNewGroup &&
    selectedPage?.groupList.some((group) => normalize(group.name) === normalize(newGroupName)) &&
    newGroupName.trim().length > 0

  const duplicateLinkName = useMemo(() => {
    if (isNewGroup || !selectedPage) return false
    const targetGroup = selectedPage.groupList[Number(groupSelection)]
    if (!targetGroup) return false
    const isSourceGroup =
      selectedPageIndex === sourcePageIndex && Number(groupSelection) === sourceGroupIndex
    if (isSourceGroup) return false

    return targetGroup.linkList.some((item) => normalize(item.text) === normalize(link.text))
  }, [
    groupSelection,
    isNewGroup,
    link.text,
    selectedPage,
    selectedPageIndex,
    sourceGroupIndex,
    sourcePageIndex,
  ])

  const sameDestination =
    !isNewPage &&
    !isNewGroup &&
    selectedPageIndex === sourcePageIndex &&
    Number(groupSelection) === sourceGroupIndex

  const disabled =
    (!isNewPage && !selectedPage) ||
    (isNewPage && (!newPageName.trim() || duplicatePageName)) ||
    (isNewGroup && (!newGroupName.trim() || duplicateGroupName)) ||
    duplicateLinkName ||
    sameDestination

  const handlePageChange = (nextPage: string) => {
    setPageSelection(nextPage)
    if (nextPage !== NEW_PAGE) {
      const page = linkPages[Number(nextPage)]
      setGroupSelection(page?.groupList.length ? '0' : NEW_GROUP)
    }
  }

  const handleConfirm = (confirm: boolean) => {
    if (!confirm || disabled) {
      onClose()
      return
    }

    if (isNewPage) {
      const pageName = newPageName.trim()
      onClose({ type: 'new-page', pageName, groupName: newGroupName.trim() }, pageName)
      return
    }

    if (isNewGroup) {
      if (!selectedPage) {
        onClose()
        return
      }
      onClose(
        { type: 'new-group', pageIndex: selectedPageIndex, groupName: newGroupName.trim() },
        selectedPage.name,
      )
      return
    }

    if (!selectedPage) {
      onClose()
      return
    }
    onClose(
      { type: 'existing', pageIndex: selectedPageIndex, groupIndex: Number(groupSelection) },
      selectedPage.name,
    )
  }

  return (
    <Dialog
      title={`Move "${link.text}"`}
      isOpen={isOpen}
      onClose={handleConfirm}
      disableConfirm={disabled}
    >
      <div className="space-y-3">
        <MoveDestinationTab
          idPrefix="move"
          pages={linkPages}
          pageSelection={pageSelection}
          onPageChange={handlePageChange}
          newPageName={newPageName}
          onNewPageNameChange={setNewPageName}
          dropdownOpen={activeDropdown === 'page'}
          onDropdownOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'page' : null)}
        />

        {isNewPage ? (
          <div className="mt-3">
            <label htmlFor="move-new-group-name" className="mb-1 block text-sm font-medium">
              New group name
            </label>
            <input
              id="move-new-group-name"
              value={newGroupName}
              onChange={(event) => setNewGroupName(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ) : (
          <div>
            <SelectWithLabel
              id="move-destination-group"
              value={groupSelection}
              isOpen={activeDropdown === 'group'}
              onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'group' : null)}
              options={[
                ...(selectedPage?.groupList.map((group, index) => ({
                  value: String(index),
                  label: group.name,
                  color: false,
                  icon: false,
                })) ?? []),
                { value: NEW_GROUP, label: 'Create a new group...', color: false, icon: false },
              ]}
              onChange={setGroupSelection}
            >
              Destination group
            </SelectWithLabel>
            {isNewGroup && (
              <div className="mt-3">
                <label htmlFor="move-new-group-name" className="mb-1 block text-sm font-medium">
                  New group name
                </label>
                <input
                  id="move-new-group-name"
                  value={newGroupName}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {duplicateGroupName && (
                  <p className="mt-1 text-sm text-red-500">
                    A group with this name already exists in this tab.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {duplicateLinkName && (
          <p className="text-sm text-red-500">
            A link named &quot;{link.text}&quot; already exists in this group.
          </p>
        )}
        {sameDestination && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This link is already in that group.
          </p>
        )}
      </div>
    </Dialog>
  )
}

export default MoveLinkDialog
