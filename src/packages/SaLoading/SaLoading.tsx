import { computed, watch } from "@vue/runtime-core";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, delay, useRefs } from "src/hooks";
import './SaLoading.scss'
import SaLoadingContainer from './type'

export default designComponent({
  
  name: 'sa-loading',
  
  props: {
    type: { type: String, default: 'alpha' }
  },

  setup({ props }) {

    const { refs, onRef } = useRefs({
      el: HTMLElement
    })

    const classes = computed(() => classname([
      'sa-loading'
    ]))

    watch(() => props.type, async val => {
      if(!val) {
        return !!refs.el && (refs.el.innerHTML = '')
      }

      await delay(23)

      if(!(SaLoadingContainer as any)[val]) {
        throw new Error(`sa-loading: un recognise type:${val}`)
      }

      !!refs.el && (refs.el.innerHTML = ((SaLoadingContainer as any)[val]().outerHTML))
    }, { immediate: true })

    return {
      refer: {
        refs
      },
      render: () => {
        return <i class={classes.value} ref={onRef.el}></i>
      }
    }
  }
})