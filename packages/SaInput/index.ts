import SaInput from './SaInput'

import { App } from 'vue'

export default {
  ...SaInput,
  install(app: App) {
    app.component(SaInput.name, SaInput)
  }
}