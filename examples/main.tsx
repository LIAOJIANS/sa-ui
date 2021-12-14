import { createApp } from 'vue'

import SaUi from '../src/packages'
import { dirHeighLight } from './directives/highlight'
import App from './App'

const app = createApp(App)

dirHeighLight(app)

app.mount('#app')

app.use(SaUi)