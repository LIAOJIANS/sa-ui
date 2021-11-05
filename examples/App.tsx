import { defineComponent } from 'vue';
import './app.scss'
import AppMenu from './layout/appMenu';
import AppMain from './layout/appMain';
import { SaRoot } from 'sa-ui'

export default defineComponent(() => {

  return () => (
    <>
      <SaRoot>
        <div class="app-head">
          <div>Sa-ui@1.0.0bate</div>
        </div>
        <AppMenu />
        <AppMain />
      </SaRoot>
    </>
  )
})
