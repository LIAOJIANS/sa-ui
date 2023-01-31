import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, createCounter, useModel, useRefs } from "src/hooks";
import { computed, CSSProperties, reactive, watch } from "vue";
import SaCollapseGroup from "../SaCollapseGroup/SaCollapseGroup";
import './SaCollapse.scss'
import SaIcon from '../SaIcon/SaIcon'
import { onMounted } from "vue";
import { delay } from "js-hodgepodge";
import SaCollapseTransition from "../SaCollapseTransition/SaCollapseTransition";

const value = createCounter('collapse')

export const SaCollapse = designComponent({
  name: 'sa-collapse',

  props: {
    modelValue: { type: Boolean, default: true },
    disabled: { type: Boolean, default: null },
    title: { type: String },
    value: { type: String },
    content: { type: String },
    customClass: { type: String }
  },

  emits: {
    onUpdateModelValue: (val?: Boolean) => true
  },

  slots: ['head', 'default'],

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const group = SaCollapseGroup.use.inject()

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

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
      onClickTitle: (e: MouseEvent) => {
        e.stopPropagation()

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
          <div class={'sa-collapse-title ' + (props.customClass || '')} >
            <div style={{ width: '100%' }} onClick={handler.onClickTitle}>{slots.head((
              <>
                <SaIcon icon="el-icon-caret-right" />
                <span>{props.title}</span>
              </>
            ))}</div>
          </div>
        }

        <SaCollapseTransition>
          <div class="sa-collapse-detail" ref={onRef.el} v-show={isOpen.value && (!!props.content || slots.default.isExist())}>
            {slots.default(props.content)}
          </div>
        </SaCollapseTransition>
      </div>
    }
  }
})

export default SaCollapse