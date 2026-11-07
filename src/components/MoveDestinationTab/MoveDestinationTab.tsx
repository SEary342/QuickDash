import { LinkPage } from '@src/types/linkPage'

import InputWithLabel from '@comp/InputWithLabel'
import SelectWithLabel from '@comp/SelectWithLabel'

import { hasDuplicatePageName, NEW_PAGE } from './moveDestinationUtils'

const MoveDestinationTab = ({
  idPrefix,
  pages,
  pageSelection,
  onPageChange,
  newPageName,
  onNewPageNameChange,
  dropdownOpen,
  onDropdownOpenChange,
}: {
  idPrefix: string
  pages: LinkPage[]
  pageSelection: string
  onPageChange: (selection: string) => void
  newPageName: string
  onNewPageNameChange: (name: string) => void
  dropdownOpen: boolean
  onDropdownOpenChange: (isOpen: boolean) => void
}) => {
  const isNewPage = pageSelection === NEW_PAGE
  const duplicatePageName = isNewPage && hasDuplicatePageName(pages, newPageName)

  return (
    <>
      <SelectWithLabel
        id={`${idPrefix}-destination-page`}
        value={pageSelection}
        isOpen={dropdownOpen}
        onOpenChange={onDropdownOpenChange}
        options={[
          ...pages.map((page, index) => ({
            value: String(index),
            label: page.name,
            color: false,
            icon: false,
          })),
          { value: NEW_PAGE, label: 'Create a new tab...', color: false, icon: false },
        ]}
        onChange={onPageChange}
      >
        Destination tab
      </SelectWithLabel>

      {isNewPage && (
        <div className="mt-3">
          <InputWithLabel
            id={`${idPrefix}-new-page-name`}
            value={newPageName}
            onInputChange={(event) => onNewPageNameChange(event.target.value)}
            hasError={duplicatePageName}
            errorText={duplicatePageName ? 'A tab with this name already exists.' : true}
          >
            New tab name
          </InputWithLabel>
        </div>
      )}
    </>
  )
}

export default MoveDestinationTab
