import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, createCounter, useModel, useRefs } from "src/hooks";
import { computed, reactive, watch } from "vue";
import SaCollapseGroup from "../SaCollapseGroup/SaCollapseGroup";
import './SaCollapse.scss'
import SaIcon from '../SaIcon/SaIcon'
import { delay } from "js-hodgepodge";

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
    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

    const state = reactive({
      realDetailStyle: {}
    } as {
      realDetailStyle: {}
    })

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

    watch(() => isOpen.value, async () => {
      const flag = isOpen.value && (!!props.content || slots.default.isExist())

      console.log(refs.el?.scrollHeight);


      state.realDetailStyle = {
        height: flag ?
          `${29 * refs.el?.children.length!}px` : '0'
      }

      await delay(500)

      state.realDetailStyle = {
        display: isOpen.value && (!!props.content || slots.default.isExist()) ? 'block' : 'none',
        height: flag ? 'auto' : 'none'
      }
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
          <div class={'sa-collapse-title ' + (props.customClass || '')} >
            <div style={{ width: '100%' }} onClick={handler.onClickTitle}>{slots.head((
              <>
                <SaIcon icon="el-icon-caret-right" />
                <span>{props.title}</span>
              </>
            ))}</div>
          </div>
        }

        <div class="sa-collapse-detail" ref={onRef.el} style={state.realDetailStyle}>
          {slots.default(props.content)}
        </div>
      </div>
    }
  }
})

export default SaCollapse