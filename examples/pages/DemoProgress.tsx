import { defineComponent } from "vue";
import { SaProgress } from 'sa-ui'

export default defineComponent({
  setup() {

    return () => (
      <SaProgress
        percentage={80}
        color={'#000'}
        width={8}
      />
    )
  }
})