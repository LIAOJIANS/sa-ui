
import Input from "./SaInput";

import { App } from 'vue'

const plugins = [
  Input
]

const install = (app: App) => {
  plugins.forEach(app.use)
}

export default {
  install
}

export {
  install,

  Input
}