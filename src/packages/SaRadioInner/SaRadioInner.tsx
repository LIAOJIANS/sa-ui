import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaRadioInner.scss'
import { useRefs } from "src/hooks";
import { computed } from "vue";

export const SaRadioInner = designComponent({
  name: 'sa-radio-inner',

  props: {
    checkStatus: { type: String }
  },

  inheritPropsType: SVGElement,
  setup({ props }) {

    const { refs, onRef } = useRefs({ el: SVGElement })

    const classes = computed(() => [
      'sa-radio-inner',
      `sa-radio-inner-${props.checkStatus}`,
    ])
    return {
      refer: { refs },
      render: () => <svg class={classes.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" ref={onRef.el}>
        {props.checkStatus === 'check' && <circle cx="50" cy="50" r="30" />}
      </svg>
    }
  }
})

export default SaRadioInner