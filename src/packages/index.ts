
import SaInput from "./SaInput";

import { App } from 'vue'

const plugins = [
  SaInput
]


const install = (app: App) => {
  plugins.forEach(app.use)
}

export default {
  install
}

export {
  install,

  SaInput
}