import { LinkPage } from '@src/types/linkPage'

/**
 * Extends Blob to support Internet Explorer 10+ to allow for local saves
 * on user disk. MsSaveBlob is deprecated in most modern browsers (chrome,Firefox)
 * it's not included in standard typescript. This allows to check for this option
 * in the browser anyways for Internet Explorer. This is used later in the
 * export config for saving to a user hardrive.
 */
declare global {
  interface Navigator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

/**
 * The exportConfig function is a utility designed to serialize the
 * application's current state (specifically the linkPages data) into
 * a JSON file and trigger a download of that file to the user's
 * local machine. It handles cross-browser compatibility, specifically
 * bridging the gap between modern browsers and legacy Internet Explorer.
 *
 * @param exportFileName
 * @param fileExtension
 * @param exportData
 */

export function exportConfig(
  exportFileName: string,
  fileExtension: string,
  exportData: LinkPage[],
) {
  const jsonFile = JSON.stringify(exportData)
  const blob = new Blob([jsonFile], { type: 'application/json' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportFileName)
  } else {
    /** The following uses a common web development technique: creating a temporary,
     * invisible link to a file in memory and programmatically "clicking" it to force
     * the browser to download the file. */
    const link = document.createElement('a')
    /**checking if the browser supports HTML5 download attribute */
    if (link.download !== undefined) {
      /** creates a temp internal URL, which allows the broswer to treat
       * the data in memory like a real file on a server */
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportFileName.concat(fileExtension))
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      /** This programitically stimulates a user click to trigger the browser's
       *  native download manager.
       */
      link.click()
      document.body.removeChild(link)
    }
  }
}
