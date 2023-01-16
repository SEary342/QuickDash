# QuickDash

![QuickDash Preview](/media/preview.png)

## Installation

1. Download QuickDash.html from the most recent Github release: https://github.com/SEary342/QuickDash/releases/latest
2. Open the html file as save it as a bookmark

## Project Develompent setup

- Change directories to the quickdash directory and run `npm install`
- After the installation is complete, you can run `npm run dev` to launch a development server instance of QuickDash

  ### Tech Stack

  | Component             | Technology                                                                                                                 |
  | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
  | UI Framework          | [Vue 3](https://vuejs.org/)                                                                                                |
  | Component Library     | [Vuetify 3](https://next.vuetifyjs.com/en/)                                                                                |
  | Language              | [TypeScript](https://www.typescriptlang.org/)                                                                              |
  | Icons                 | [Material Design Icons](https://icon-sets.iconify.design/mdi/)                                                             |
  | Persistant Data Store | [Pinia](https://pinia.vuejs.org/) & [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) |

## Page deployment

To deploy your changes, run `npm run build` in the quickdash directroy and copy the quickdash/dist/QuickDash.html file to it's deployed destination.

Please note that the build process is customized for a static (local) webpage deployment. This app does not require a server.
