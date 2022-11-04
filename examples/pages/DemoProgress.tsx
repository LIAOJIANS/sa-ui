import { defineComponent } from "vue";
import { SaProgress } from 'sa-ui'

export default defineComponent({
  setup() {

    return () => (
      <SaProgress
        percentage={80}
        gradientsAnimation
        gradients={['#6CC6CB', '#EAE5C9']}
        width={8}
      />
    )
  }
})