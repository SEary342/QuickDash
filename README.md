# quickdash

## Project setup
Change directories to the quickdash directory and run `yarn install`

## Page customization
To customize the links displayed, open quickdash/src/LinkConfig.ts and modify the underlying link data as needed. Please note that color options are present in quickdash/src/ConfigStructure.ts.

Once your links are customized, you can test your changes by running `yarn serve` in the quickdash directroy. 

## Page deployment
To deploy your changes, run `yarn build` in the quickdash directroy and copy the quickdash/dist folder to it's deployed destination.

Please note that the build process is customized for a local webpage deployment. A server is not required.

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).