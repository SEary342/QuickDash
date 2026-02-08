import { mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { addLinkData } from '@src/store/store'

import LinkDialog from '@comp/LinkDialog'

const LinkAdd = ({ pageId, panelId }: { pageId: number; panelId: number }) => {
  const dispatch = useDispatch()
  const [addDialog, setAddDialog] = useState(false)
  return (
    <div className="relative flex items-center gap-3 m-3 hover:shadow-md rounded-xl border-3 border-black dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
      <LinkDialog
        key={addDialog ? 'open' : 'closed'}
        pageId={pageId}
        panelId={panelId}
        editMode={false}
        isOpen={addDialog}
        onClose={(link) => {
          if (link) {
            dispatch(addLinkData({ pageIndex: pageId, groupIndex: panelId, link }))
          }
          setAddDialog(false)
        }}
      />
      <span
        className=" flex cursor-pointer w-full pl-3 py-3 rounded-s-xl"
        onClick={() => setAddDialog(true)}
      >
        <Icon path={mdiPlus} size={1} className="text-black dark:text-white" />
        <span className="font-bold ms-3 text-black dark:text-white">Add Link</span>
      </span>
    </div>
  )
}

export default LinkAdd
