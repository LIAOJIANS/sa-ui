// @ts-nocheck

import { defineComponent, ref, shallowReactive } from "vue";
import { SaSelect } from 'sa-ui'


export default defineComponent({
  setup() {

    const refs = ref(null)

    shallowReactive(() => {

      return refs.value
    })

    return () => <div ref={ refs.value }>
      <SaSelect 
        
      />
    </div>
  }
})