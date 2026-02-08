/**
 * The Dash component is the core view of the QuickDash application.
 * It is responsible for rendering the currently selected dashboard page,
 * managing the layout of link groups across columns, and handling page navigation (tabs).
 */
import { mdiPlus } from '@mdi/js'
import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState, addLinkPage, deleteLinkPage, setSelectedDash } from '@src/store/store'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import PanelDialog from '@comp/DashGroupDialog'
import IconBtn from '@comp/IconBtn'
import LinkPanel from '@comp/LinkPanel'
import LinkPanelAdd from '@comp/LinkPanelAdd'
import QuickDashWelcome from '@comp/QuickDashWelcome'
import TabBtn from '@comp/TabBtn'

/**
 * Column Layout & Balancing
 * Uses a weighted system where groups with more links are "weighted" heavier ensuring
 * columns are roughly equal in height rathan than just having an equal number of groups
 * @param linkGroups
 * @param groupsCount
 * @returns 2D array of LinkGroup with columns / group
 */

function distributeLinkGroups(linkGroups: LinkGroup[], groupsCount: number): LinkGroup[][] {
  // 1. Calculate weight for each group (links count + 1 for the header)
  const weightedGroups = linkGroups.map((group) => ({
    ...group,
    weight: group.linkList.length + 1,
  }))

  // 2. Calculate total weight of all groups combined
  const totalWeight = weightedGroups.reduce((acc, group) => acc + group.weight, 0)

  // 3. Determine the ideal weight per column (average)
  const targetWeightPerGroup = Math.floor(totalWeight / groupsCount)

  let currentGroupWeight = 0
  let currentGroup: LinkGroup[] = []
  const result: LinkGroup[][] = []

  // 4. Distribute groups into columns
  for (const group of weightedGroups) {
    currentGroup.push(group)
    currentGroupWeight += group.weight

    // If current column is full enough (>= target) OR we are at the very last group
    if (
      currentGroupWeight >= targetWeightPerGroup ||
      weightedGroups.indexOf(group) === weightedGroups.length - 1
    ) {
      result.push(currentGroup)
      currentGroup = []
      currentGroupWeight = 0
    }
  }

  // 5. Ensure we return exactly 'groupsCount' columns, filling remaining with empty arrays if needed
  while (result.length < groupsCount) {
    result.push([])
  }

  return result
}

/**
 * Renders the header navigation bar and scrollable content
 * @param linkPages
 * @returns 2D array (column of groups)
 */
const Dash = ({ linkPages }: { linkPages: LinkPage[] }) => {
  // Hook to dispatch actions to the Redux store
  const dispatch = useDispatch()

  // Selects the currently active dashboard name from the Redux store
  const selectedDash = useSelector((state: RootState) => state.app.selectedDash)

  // Local state to toggle the visibility of the "Add Page" dialog
  const [addPage, setAddPage] = useState(false)

  // Finds the index of the currently selected dashboard in the linkPages array
  const pageIndex = linkPages.findIndex((page) => page.name === selectedDash)

  // Ensures a valid index is used; defaults to 0 if the selected dash is not found
  const resolvedPageIndex = pageIndex !== -1 ? pageIndex : 0

  // Selects the user-configured number of columns from the Redux store
  const columns = useSelector((state: RootState) => state.app.numberOfColumns)

  // Retrieves the current Link page for which of the many pages needs to be displayed right now
  const renderedPage = linkPages[resolvedPageIndex]

  // Extracts the list of link groups for the current page (defaults to empty array if page is undefined)
  const groupList = renderedPage ? renderedPage.groupList : []

  // Distributes the groups into columns based on their "weight" (number of links)
  const columnGroups = distributeLinkGroups(groupList, columns)

  /**
   * Flattens the 2D column array back into a 1D array to calculate global indices for
   * reordering. The "move up/Moved down" burons need to know the global index of the page
   * toallow for reordering of the groups
   **/
  const flattenedGroups = columnGroups.flat()

  // Total number of groups, used to determine if "Move Down" buttons should be enabled
  const totalGroups = flattenedGroups.length

  /**
   * Handler to switch the active dashboard when a tab is clicked. The page needs to
   *  reload the new linkGroups.
   */
  const handlePageIndexChange = (newIndex: number) => {
    if (linkPages[newIndex]) {
      dispatch(setSelectedDash(linkPages[newIndex].name))
    }
  }

  // Reference to the header/tab bar element to measure its height
  const aboveScrollRef = useRef<HTMLDivElement>(null)

  // State to store the calculated height of the scrollable content area
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number | null>(null)

  /**
   * This is used to ensure the content fills the entire page exactly,
   * allowing forinternal scollbar rather than scrolling the entire page.
   */
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (aboveScrollRef.current) {
        const rect = aboveScrollRef.current.getBoundingClientRect()
        const offsetTop = rect.top // Distance from top of viewport
        const height = rect.height

        //  Calculates how tall the main content should be so the "header" doesn't move when scrolling
        const totalOffset = offsetTop + height

        setScrollAreaHeight(window.innerHeight - totalOffset)
      }
    }

    updateHeight()

    // Add event listener to recalculate height when window is resized
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [linkPages.length])

  return (
    <>
      {/* 1. Header / Tab Navigation Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700" ref={aboveScrollRef}>
        <ul className="flex flex-wrap text-sm font-medium text-center ms-0.5">
          {/* Iterate through all available dashboard pages to create tabs */}
          {linkPages.map((pg, idx) => (
            <TabBtn
              key={`${pg.name}-${idx}`}
              id={idx}
              linkPage={pg}
              // Only show left chevron if not the first tab
              chevronLeft={idx !== 0}
              // Only show right chevron if not the last tab
              chevronRight={idx < linkPages.length - 1}
              tabSelectFunc={handlePageIndexChange}
              selected={resolvedPageIndex === idx}
              onRemove={(id) => {
                // Logic to determine which page to select if the current one is deleted
                const newPage =
                  selectedDash === linkPages[id].name
                    ? linkPages[id - 1]?.name || linkPages[id + 1]?.name || ''
                    : linkPages[id].name
                dispatch(deleteLinkPage(id))
                dispatch(setSelectedDash(newPage))
              }}
            />
          ))}
          {/* The "Add New Dashboard" button at the end of the tab list */}
          <li className="flex items-center justify-center">
            <IconBtn
              path={mdiPlus}
              className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
              tooltipText="Add Dash"
              tooltipPosition="right"
              color="text-black dark:text-white"
              onClick={() => setAddPage(!addPage)}
              size={1.5}
            />
            {/* Dialog for creating a new dashboard page */}
            <PanelDialog
              key={addPage ? 'open' : 'closed'}
              isOpen={addPage}
              onClose={(linkPage?: LinkPage) => {
                if (linkPage) {
                  dispatch(addLinkPage(linkPage))
                  dispatch(setSelectedDash(linkPage.name))
                }
                setAddPage(false)
              }}
            />
          </li>
        </ul>
      </div>
      {/* 2. Main Scrollable Content Area */}
      <div
        className="overflow-y-auto"
        style={{
          // Apply the calculated height to ensure internal scrolling
          height: scrollAreaHeight !== null ? `${scrollAreaHeight}px` : 'auto',
        }}
      >
        {/* Show welcome screen if no dashboards exist */}
        {linkPages.length == 0 && <QuickDashWelcome />}
        {/* Animation wrapper for smooth page transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 mt-2"
            // Dynamic grid columns based on user settings
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {/* Render each column of link groups */}
            {columnGroups.map((groupColumn, colIdx) => {
              // Logic to determine where to place the "Add Group" panel
              const isFirstEmptyColumn =
                groupColumn.length === 0 &&
                columnGroups.findIndex((col) => col.length === 0) === colIdx
              const isLastColumn = colIdx === columnGroups.length - 1
              // Place "Add Group" in the first empty column found, OR at the bottom of the last column
              const shouldRenderAddPanel =
                linkPages.length > 0 &&
                (isFirstEmptyColumn ||
                  (isLastColumn && columnGroups.every((col) => col.length > 0)))
              return (
                <div key={`column-${colIdx}`} className="flex flex-col gap-4">
                  {/* Render all groups assigned to this column */}
                  {groupColumn.map((gp, idx) => {
                    // Calculate global index for reordering logic
                    const globalIndex = flattenedGroups.indexOf(gp)
                    return (
                      <LinkPanel
                        pageId={pageIndex}
                        panelId={globalIndex}
                        key={`${gp.name}-${idx}`}
                        linkGroup={gp}
                        // Enable "Move Up" unless it's the very first group
                        moveUp={globalIndex > 0}
                        // Enable "Move Down" unless it's the very last group
                        moveDown={globalIndex < totalGroups - 1}
                      />
                    )
                  })}
                  {/* Render the "Add Group" panel if this is the correct column */}
                  {shouldRenderAddPanel && <LinkPanelAdd pageId={pageIndex} />}
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default Dash
