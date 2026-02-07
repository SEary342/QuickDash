import {
  mdiChevronDown,
  mdiChevronUp,
  mdiFormatListGroup,
  mdiPencil,
  mdiPlaylistEdit,
} from '@mdi/js'
import Icon from '@mdi/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { deleteLinkGroup, reorderLinkGroups, updateLinkGroup } from '@src/store/store'
import { getColorLookup } from '@src/types/colors'
import { iconTranslation } from '@src/types/icons'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import PanelDialog from '@comp/DashGroupDialog'
import IconBtn from '@comp/IconBtn'
import Link from '@comp/Link'
import LinkAdd from '@comp/LinkAdd'

const LinkPanel = ({
  pageId,
  panelId,
  linkGroup,
  moveUp,
  moveDown,
}: {
  pageId: number
  panelId: number
  linkGroup: LinkGroup
  moveUp: boolean
  moveDown: boolean
}) => {
  const dispatch = useDispatch()
  const [tabEdit, setTabEdit] = useState(false)
  const [editDialog, setEditDialog] = useState(false)

  const iconLookup = linkGroup.icon ? iconTranslation[linkGroup.icon] : mdiFormatListGroup
  const colorLookup = getColorLookup(linkGroup.color)

  return (
    <div className="rounded-md flex flex-col border border-black m-3 bg-white overflow-hidden">
      <div
        className={`flex flex-row w-full ${colorLookup.text} p-3 items-center font-bold ${colorLookup.background}`}
      >
        {linkGroup.icon && <Icon path={iconLookup} size={1} />}
        <span className="ml-3 text-xl">{linkGroup.name}</span>
        <AnimatePresence>
          {tabEdit && (
            <motion.div
              className="flex flex-row ml-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <IconBtn
                path={mdiPencil}
                className={colorLookup.hoverColor}
                tooltipText="Edit Group"
                color={colorLookup.text}
                size={1}
                onClick={() => setEditDialog(true)}
              />
              {moveUp && (
                <IconBtn
                  path={mdiChevronUp}
                  tooltipText="Move Up"
                  color={colorLookup.text}
                  className={colorLookup.hoverColor}
                  size={1}
                  onClick={() =>
                    dispatch(
                      reorderLinkGroups({
                        pageIndex: pageId,
                        fromIndex: panelId,
                        toIndex: panelId - 1,
                      }),
                    )
                  }
                />
              )}
              {moveDown && (
                <IconBtn
                  path={mdiChevronDown}
                  tooltipText="Move Down"
                  color={colorLookup.text}
                  className={colorLookup.hoverColor}
                  size={1}
                  onClick={() =>
                    dispatch(
                      reorderLinkGroups({
                        pageIndex: pageId,
                        fromIndex: panelId,
                        toIndex: panelId + 1,
                      }),
                    )
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="ml-auto">
          <IconBtn
            className={`focus:outline-2 focus:outline-offset-2 ${colorLookup.focus} ${colorLookup.hoverColor}`}
            path={mdiPlaylistEdit}
            tooltipText={tabEdit ? 'Hide Controls' : 'Show Controls'}
            color={colorLookup.text}
            size={1}
            onClick={() => setTabEdit(!tabEdit)}
          />
        </div>
      </div>
      <div className="pt-1 pb-3">
        <AnimatePresence initial={false}>
          {linkGroup.linkList.map((item, index) => (
            <motion.div
              key={item.url + index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                pageId={pageId}
                panelId={panelId}
                id={index}
                item={item}
                upArrow={index !== 0}
                downArrow={index !== linkGroup.linkList.length - 1}
                editMode={tabEdit}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {tabEdit && (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LinkAdd pageId={pageId} panelId={panelId} />
          </motion.div>
        )}
      </div>
      <PanelDialog
        key={editDialog ? 'editing' : 'closed'}
        isOpen={editDialog}
        onClose={(_?: LinkPage, updatedGroup?: LinkGroup, remove?: boolean) => {
          if (remove) {
            dispatch(deleteLinkGroup({ pageIndex: pageId, groupIndex: panelId }))
          } else if (updatedGroup) {
            dispatch(
              updateLinkGroup({ pageIndex: pageId, groupIndex: panelId, group: updatedGroup }),
            )
          }
          setEditDialog(false)
        }}
        editMode={true}
        groupMode={true}
        pageId={pageId}
        linkGroup={linkGroup}
      />
    </div>
  )
}

export default LinkPanel
