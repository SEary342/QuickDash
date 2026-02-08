import { mdiPlus } from '@mdi/js'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { addLinkGroup } from '@src/store/store'
import { getColorLookup } from '@src/types/colors'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import PanelDialog from '@comp/DashGroupDialog'
import IconBtn from '@comp/IconBtn'

const colorLookup = getColorLookup('unknown')

const LinkPanelAdd = ({ pageId }: { pageId: number }) => {
  const dispatch = useDispatch()
  const [addGroup, setAddGroup] = useState(false)
  return (
    <div className="rounded-md flex flex-col border border-black dark:border-gray-600 m-3 bg-white dark:bg-gray-800">
      <div
        className={`flex flex-row w-full ${colorLookup.text} rounded-t-md px-3 py-3 items-center font-bold ${colorLookup.background}`}
      >
        <span className="ml-3 text-xl">Add Group</span>
        <IconBtn
          path={mdiPlus}
          size={0.8}
          tooltipText="Add Group"
          color={colorLookup.text}
          className={`border-2 border-black dark:border-gray-400 ml-auto ${colorLookup.hoverColor}`}
          onClick={() => setAddGroup(true)}
        />
        <PanelDialog
          key={addGroup ? 'open' : 'closed'}
          isOpen={addGroup}
          onClose={(_?: LinkPage, linkGroup?: LinkGroup) => {
            if (linkGroup) {
              dispatch(
                addLinkGroup({
                  pageIndex: pageId,
                  group: linkGroup,
                }),
              )
            }
            setAddGroup(false)
          }}
          editMode={false}
          groupMode={true}
          pageId={pageId}
        />
      </div>
      <div className="pb-4"></div>
    </div>
  )
}

export default LinkPanelAdd
