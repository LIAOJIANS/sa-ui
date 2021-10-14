import { App } from 'vue'

import * as SaUi from './enter'

const install = (app: App) => {

  Object.entries(SaUi).forEach(([ key, item ]) => {
    if('install' in item) {
      app.use(item as any)
    }
  })
}

export {
  install
}

export * from './enter'

export default {
  ...SaUi,
  install
}