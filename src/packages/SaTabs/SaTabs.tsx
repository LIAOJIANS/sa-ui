import { PropType, reactive, onMounted, computed  } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTabs.scss'
import { useModel, useCollect, useRefs, useStyles, classname } from "../../hooks";
import SaTabPane from "../SaTabPane/SaTabPane";
import SaScroll from '../SaScroll/SaScroll'

enum SaTabType {
  Default = 'default',
  Card = 'card',
  CorderCard = 'border-card'
}

export const SaTabs = designComponent({
  name: 'sa-tabs',

  props: {
    modelValue: {},
    type: { type: String as PropType<SaTabType>, default: SaTabType.Default }
  },

  emits: {
    onChange: (val: any) => true,
  },

  slots: ['default'],
  setup({ props, slots, event: { emit } }) {

    const state = reactive({
      paneMap: new Map(),
      widthBar: '',
      offsetleftBar: ''
    })

    const child = SaTabsCollect.parent()

    const model = useModel(() => props.modelValue, emit.onChange)

    const { onRef, refs } = useRefs({
      pane: HTMLDivElement
    })

    const curPanContent = computed(() => state.paneMap.get(model.value) || (() => null))

    const classes = computed(() => classname([
      `sa-tabs`,
      `sa-tabs--${props.type}`
    ]))

    const barStyles = useStyles(style => {
      style.width = state.widthBar
      style.transform = `translateX(${state.offsetleftBar})`
    })

    const methods = {
      getActiveDom: () => {
        const activeChild = [...(refs.pane?.children || [])] 
          .find((dom: Element) => dom.getAttribute('data-pane') === model.value) as HTMLDivElement

        state.offsetleftBar = activeChild.offsetLeft + 'px'
        state.widthBar = activeChild.offsetWidth + 'px'
      }
    }

    const handler = {
      handleActive: (val: any) => {
        model.value = val

        methods
          .getActiveDom()
      }
    }

    onMounted(() => {
      child.forEach((c: any) => state.paneMap.set(c.paneKey, c._.slots.default))

      methods
        .getActiveDom()
    })
    

    return {
      refer: {
        handler,
        model
      },
      render: () => (
        <div class={classes.value}>
          <SaScroll fitHostWidth fitHostHeight>
            <div class="sa-tabs-nav" ref={ onRef.pane }>
              { props.type === SaTabType.Default && (
                <div class="sa-tabs-active__bar" style={{ ...barStyles.value }}></div>
              ) }
              
              { slots.default.isExist() && slots.default() }
            </div>
          </SaScroll>
          
          <div class="sa-pane-content">
            { curPanContent.value() }
          </div>
        </div>
      )
    }
  }
})

export const SaTabsCollect = useCollect(() => ({
  parent: SaTabs,
  child: SaTabPane
}))

export default SaTabs


