import { defineComponent } from 'vue';
import './app.scss'
import AppMenu from './layout/appMenu';
import AppMain from './layout/appMain';

export default defineComponent(() => {
  return () => (
    <>
      <div class="main">
        <AppMenu />
        <AppMain />
      </div>
    </>
  )
})
