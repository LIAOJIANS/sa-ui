import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, createCounter, useModel } from "src/hooks";
import { computed } from "vue";
import SaCollapseGroup from "../SaCollapseGroup/SaCollapseGroup";
import './SaCollapse.scss'
import SaIcon from '../SaIcon/SaIcon'

const value = createCounter('collapse')

export const SaCollapse = designComponent({
  name: 'sa-collapse',

  props: {
    modelValue: { type: Boolean, default: true },
    disabled: { type: Boolean, default: null },
    title: { type: String },
    value: { type: String },
    content: { type: String }
  },

  emits: {
    onUpdateModelValue: (val?: Boolean) => true
  },

  slots: ['head', 'default'],

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const group = SaCollapseGroup.use.inject()

    const slefValue = computed(() => props.value || value())

    const isOpen = computed(() => {
      if (!!group) {
        return group.utils.isOpen(slefValue.value)
      } else {
        return model.value
      }
    })

    const classes = computed(() => classname([
      'sa-collapse',
      {
        'sa-collapse-is-open': isOpen.value
      }
    ]))

    const isDisabled = computed(() => {
      if (props.disabled != null) {
        return props.disabled
      }
      if (!!group) {
        return group.props.disabled
      }
      return false
    })

    const handler = {
      onClickTitle: () => {
        if (isDisabled.value) {
          return
        }
        if (!!group) {
          group.handler.clickCollapseTitle(slefValue.value)
        } else {
          model.value = !model.value
        }
      }
    }

    return {
      render: () => <div class={classes.value}>
        {
          (slots.head.isExist() || props.title) &&
          <div class="sa-collapse-title">
            <SaIcon icon="el-icon-caret-right" onClick={handler.onClickTitle} />
            <div onClick={handler.onClickTitle}>{slots.head(props.title)}</div>
          </div>
        }

        <div class="sa-collapse-detail" style={{ display: isOpen.value && (!!props.content || slots.default.isExist()) ? '' : 'none' }}>
          {slots.default(props.content)}
        </div>
      </div>
    }
  }
})

export default SaCollapse