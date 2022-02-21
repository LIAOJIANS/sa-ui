import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, classname } from "src/hooks";
import { computed, SVGAttributes } from "vue";
import './SaCheckboxInner.scss'

export const SaCheckboxInner = designComponent({
  name: 'sa-checkbox-inner',
  props: {
    disabled: { type: Boolean },
    checkStatus: { type: String }
  },
  inheritPropsType: {} as SVGAttributes,
  setup({ props }) {

    const classes = computed(() => classname([
      'sa-checkbox-inner',
      `sa-checkbox-inner-status-${props.checkStatus}`,
      {
        'sa-checkbox-inner-disabled': props.disabled,
      }
    ]))

    return {
      render: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class={classes.value}>
        {props.checkStatus === CheckboxStatus.check && <polyline points="22,50 45,75 75,25" class="sa-checkbox-inner-check-polyline" />}
        {props.checkStatus === CheckboxStatus.minus && <rect x="15" y="15" width="70" height="70" class="sa-checkbox-inner-minus-polyline" />}
      </svg>
    }
  }
})

export default SaCheckboxInner