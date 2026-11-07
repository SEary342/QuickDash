import { LinkPage } from '@src/types/linkPage'

export const NEW_PAGE = 'new-page'

export const hasDuplicatePageName = (pages: LinkPage[], pageName: string) => {
  const normalizedName = pageName.trim().toLocaleLowerCase()
  return (
    normalizedName.length > 0 &&
    pages.some((page) => page.name.trim().toLocaleLowerCase() === normalizedName)
  )
}
