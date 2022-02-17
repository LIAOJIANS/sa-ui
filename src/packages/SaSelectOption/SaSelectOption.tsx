import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useRefs } from "src/hooks";
import { computed } from "vue";
import { SelectCollector } from "../SaSelect/SaSelect";
import { SelectPanelCollector } from "../SaSelect/SaSelectPanel";
import { SelectGroupCollector } from "../SaSelectGroup/SaSelectGroup";
import SaIcon from '../SaIcon/SaIcon'

export const SaSelectOption = designComponent({
  name: 'sa-select-option',

  props: {
    label: { type: [String, Number], required: true },
    val: { type: [String, Number], required: true },
    icon: { type: String },
    disabled: { type: Boolean },

    group: { type: Boolean },
  },

  slots: ['default'],
  setup({ props, slots }) {
    const { refs, onRef } = useRefs({
      el: HTMLDivElement
    })

    SelectCollector.child({ injectDefaultValue: null, sort: () => refs.el! })

    const group = SelectGroupCollector.child({ injectDefaultValue: null })
    const panel = SelectPanelCollector.child({ injectDefaultValue: null, sort: () => refs.el! })
    const isShow = computed(() => (props.group || !panel || panel.utils.isShow(props)))
    const isSelected = computed(() => !!panel && panel.utils.isSelected(props))

    const refer = {
      props,
      refs,
    }

    const classes = computed(() => classname([
      'sa-select-option',
      {
        'sa-select-option-disabled': props.disabled,
        'sa-select-option-show': isShow.value,
        'sa-select-option-selected': isSelected.value,
        'sa-select-option-highlight': !!panel && !!panel.current.value && panel.current.value.props === props,
        'sa-select-option-group-child': !!group && !props.group,
      }
    ]))

    const handler = {
      click: () => {
        if (props.group) return
        !!panel && panel.handler.clickOption(refer)
      }
    }

    return {
      refer,
      render: () => <div
        {...{
          ref: onRef.el,
          label: props.label,
          val: props.val,
          icon: props.icon,
          class: classes.value,
          onClick: handler.click,
        }} >
        {!!panel && isShow.value && <>
          {!!panel.props.multiple && !props.group ? <div>dui</div> : null}
          {!!props.icon && <SaIcon icon={props.icon} class="sa-select-option-icon" />}
          {slots.default(props.label)}
        </>}
      </div>
    }
  }
})


export type SelectOption = typeof SaSelectOption.use.class


export default SaSelectOption