import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaLoadingMask.scss'
import { classname, delay, nextIndex, useModel, useRefs, useStyles } from "src/hooks";
import { onMounted } from "vue";
import { Transition, computed, reactive } from "vue";
import SaLoading from '../SaLoading/SaLoading'

export const SaLoadingMask = designComponent({
  name: 'sa-loading-mask',

  props: {
    modelValue: { type: Boolean },            // 是否打开遮罩层
    unlock: { type: Boolean },                  // 取消阻止点击事件
    fixedPosition: { type: Boolean },           // 是否为根节点的加载遮罩
    background: { type: String, default: 'rgba(255,255,255,0.85)' }, // 遮罩层背景
    message: { type: String },                                         // 提示信息
    loadingType: { type: String, default: 'alpha' },                   // loading类型
  },

  emits: {
    onUpdateModelValue: (val?: boolean) => true
  },

  inheritPropsType: HTMLDivElement,

  setup({ props, event: { emit } }) {
    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { refs, onRef } = useRefs({
      el: HTMLElement
    })

    const state = reactive({
      zIndex: nextIndex() + (!props.fixedPosition ? -1500 : 0) + 1,
      isMounted: false
    })

    const classes = computed(() => classname([
      'sa-loading-mask',
      {
        'sa-loading-mask-unlock': props.unlock,
        'sa-loading-mask-fixed-position': props.fixedPosition
      }
    ]))

    const styles = useStyles(style => {
      style.backgroundColor = props.background
      style.zIndex = state.zIndex
    })

    const utils = {
      resetParentPosition: async () => {
        if (props.fixedPosition) {  //  ---- flex定位直接返回
          return
        }

        await delay()

        if (refs.el) {
          let parentNode = refs.el.parentNode as HTMLElement

          if (!!parentNode) {
            const styles = window.getComputedStyle(parentNode)
            if (['absolute', 'relative', 'fixed'].indexOf(styles.position) === -1) {
              parentNode.style.position = 'relative'
            }
          }

        }
      }
    }

    onMounted(async () => {
      await utils.resetParentPosition()

      state.isMounted = true
    })

    return {

      refer: {
        refs
      },

      render: () => <Transition>
        {
          !!model.value && state.isMounted &&(
            <div class={classes.value} style={styles.value} ref={onRef.el}>
              <SaLoading type={ props.loadingType } />
              {!!props.message && <span>{props.message}</span>}
            </div>
          )
        }
      </Transition>
    }
  }
})

export default SaLoadingMask