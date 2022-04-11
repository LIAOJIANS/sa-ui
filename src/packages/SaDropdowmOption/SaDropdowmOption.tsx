import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useRefs } from "src/hooks";
import SaIcon from "../SaIcon/SaIcon";
import SaDropdownMenu from "../SaDropdownMenu/SaDropdownMenu";
import { computed } from "vue";

export const SaDropdowmOption = designComponent({
  name: 'sa-dropdowm-option',

  props: {
    icon: { type: String },
    label: { type: String },
    value: {},
    disabled: { type: Boolean },
    align: { type: String, defalut: 'left' }
  },

  slots: ['default'],
  inheritPropsType: HTMLDivElement,
  emits: {
    onClick: (e: MouseEvent) => true
  },
  setup({ props, slots, event: { emit } }) {

    const { onRef, refs } = useRefs({
      el: HTMLElement
    })

    const dropdownMenu = SaDropdownMenu.use.inject()
    
    const handler = {
      onClickItem: (e: MouseEvent) => {
        if(props.disabled) {
          return
        }

        emit.onClick(e)
        dropdownMenu.handler.clickOption(e, props.value) // ---- 事件委托到组件，通知是否关闭popper
      }
    }

    const classes = computed(() => classname([
      'sa-dropdown-option',
      `sa-dropdown-option-align-${props.align}`,
      {
        'sa-dropdown-option-disabled': props.disabled
      }
  ]))


    return {
      refer: {
        refs
      },

      render: () => (
        <div ref={onRef.el} onClick={handler.onClickItem} class={classes.value}>
          {!!props.icon && <SaIcon icon={props.icon} class="sa-dropdown-option-icon" /> }
          { slots.default(props.label) }
        </div>
      )
    }
  }
})

export default SaDropdowmOption