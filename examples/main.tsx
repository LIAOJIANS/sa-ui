import { createApp } from 'vue'

import SaUi from '../packages'

import App from './App'

const app = createApp(App)

app.mount('#app')

app.use(SaUi)