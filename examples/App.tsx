import { defineComponent } from 'vue';
import './app.scss'
import AppMenu from './layout/appMenu';
import AppMain from './layout/appMain';

export default defineComponent(() => {
  return () => (
    <>
      <div class="main">
        <div class="app-head">
          <div>Sa-ui@1.0.0bate</div>
        </div>
        <AppMenu />
        <AppMain />
      </div>
    </>
  )
})
