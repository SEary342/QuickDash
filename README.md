# QuickDash

![QuickDash Preview](/media/preview.png)

## Installation (Automatic Updates)

1. Set your home/new tab page in your browser to https://seary342.github.io/QuickDash/ or save it as a bookmark
2. Navigate to the page
3. Add links & enjoy!

## Local Installation (Manual Updates)

1. Download QuickDash.html from the most recent Github release: https://github.com/SEary342/QuickDash/releases/latest
2. Open the html file as save it as a bookmark
3. Add links & enjoy!

## Feature / Issue Requests

Requests for new features to improve QuickDash or submission of bugs and issues can be made at [https://github.com/SEary342/QuickDash/issues](https://github.com/SEary342/QuickDash/issues)

## Colors and Icons

- New colors/Icons can be requested by creating an issue at [https://github.com/SEary342/QuickDash/issues](https://github.com/SEary342/QuickDash/issues)
- The available icons can be selected from [MDI Icons](https://pictogrammers.com/library/mdi/)
  - Total icons approved are limited to reduce package size.

## Project Develompent setup

- Change directories to the quickdash directory and run `npm install`
- After the installation is complete, you can run `npm run dev` to launch a development server instance of QuickDash

  ### Tech Stack

  | Component    | Technology                                                     |
  | ------------ | -------------------------------------------------------------- |
  | UI Framework | [React 19](https://react.dev/)                                 |
  | CSS Library  | [tailwindcss](https://tailwindcss.com/)                        |
  | Language     | [TypeScript](https://www.typescriptlang.org/)                  |
  | Icons        | [Material Design Icons](https://icon-sets.iconify.design/mdi/) |

## Page deployment

To deploy your changes, run `npm run build` in the quickdash directory and copy the quickdash/dist/index.html file to it's deployed destination (You are going to want to rename the output file).

Please note that the build process is customized for a static (local) webpage deployment. This app does not require a server.
