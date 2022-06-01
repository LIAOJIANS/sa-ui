import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useModel, useStyle, useRefs, unit, Styles } from "src/hooks";
import { Teleport, Transition, computed, PropType, reactive } from "vue";
import SaButton from "../SaButton/SaButton";
import SaIcon from "../SaIcon/SaIcon";

import './SaDialog.scss'

export const SaDialog = designComponent({

  name: 'sa-dialog',

  props: {
    style: Styles,
    modelValue: { type: Boolean },
    width: { type: [Number, String] },

    transition: { type: String, default: 'sa-transition-dialog' },
    mask: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: true },                      // 关闭窗口是否销毁实例

    top: { type: [String, Number] },
    height: { type: [String, Number] },
    minHeight: { type: [String, Number] },
    maxHeight: { type: [String, Number] },

    scroll: { type: Boolean },

    title: { type: [String, Boolean], default: '提示' },
    showClose: { type: Boolean, default: true },
    footerAlign: { type: String as PropType<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'> },
    confirmButton: { type: [Boolean, Object] as PropType<boolean | { confirmButtonText: string }> },     // 是否显示确认按钮
    cancelButton: { type: [Boolean, Object] as PropType<boolean | { cancelButtonText: string }> },      // 是否显示取消按钮

    loading: { type: Boolean },                                               // 弹出框添加 加载中的遮罩
  },

  emits: {
    onUpdateModelValue: (val?: boolean) => true,
    onOpen: () => true,
    onClose: () => true,
    onConfirm: () => true,
    onCancel: () => true,
  },

  slots: [
    'footer',
    'header',
    'default'
  ],

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const { onRef } = useRefs({
      el: HTMLDivElement,
      body: HTMLDivElement,
    })

    const state = reactive({
      loading: false
    })

    /* -------------------------------------------------- computed ------------------------------------------------------- */

    const { styleComputed } = useStyle({ status: undefined })

    const classes = computed(() => classname([
      'sa-dialog',
      props.transition,
      {
        'sa-dialog-no-mask': !props.mask,
      }
    ]))

    const bodyClasses = computed(() => classname([
      'sa-dialog-body',
      `sa-dialog-body-shape-${styleComputed.value.shape}`,
    ]))

    const contentClasses = computed(() => classname([
      'sa-dialog-content',
      {
        'sa-dialog-content-scroll': scroll.value
      }
    ]))

    const buttonText = computed(() => {

      const {
        confirmButton,
        cancelButton
      } = props

      return {
        confirmButtonText: typeof confirmButton === 'object' && confirmButton.confirmButtonText ? confirmButton.confirmButtonText : '确定',
        cancelButtonText: typeof cancelButton === 'object' && cancelButton.cancelButtonText ? cancelButton.cancelButtonText : '取消'
      }
    })

    const contentStyle = computed(() => {
      let height = props.height || null
      let width = props.width || null

      let minHeight = props.minHeight || null
      let maxHeight = props.maxHeight || null

      return {
        ...props.style,
        height: unit(height),
        width: unit(width),
        minHeight: unit(minHeight),
        maxHeight: unit(maxHeight)
      }
    })

    const footer = computed(() => slots.footer.isExist() || props.confirmButton || props.cancelButton)

    const header = computed(() => slots.header.isExist() || props.title)

    const loading = computed(() => state.loading || props.loading)

    const scroll = computed(() => props.scroll && (props.height || props.maxHeight || props.minHeight)) as { value: boolean }

    /* ---------------------------------- methods -------------------------------- */

    const methods = {
      cancel() {
        methods.hide()
        emit.onCancel()
      },

      confirm() {
        console.log('提交');
        
      },

      async hide() {
        console.log('取消');
      }

    }

    /* ---------------------------------- header -------------------------------- */

    const handler = {
      clickClose() {
        if (loading.value) {
          return
        }

        methods.cancel()
      }
    }

    return {
      render: () => <Teleport to=".sa-root-service-container">
        <Transition name={props.transition}>
          {(() => {

            const Content = (
              <div class={classes.value} ref={onRef.el} >

                <div class={bodyClasses.value} ref={onRef.body}>

                  {header.value && <div class="sa-dialog-head">
                    {slots.header(<span class="sa-dialog-head-title">{props.title}</span>)}
                    {!!props.showClose && (
                      <div class="sa-dialog-head-close" onClick={handler.clickClose}>
                        <SaIcon icon="el-icon-close" />
                      </div>
                    )}
                  </div>
                  }

                  <div class={contentClasses.value} style={contentStyle.value as any}>
                    {slots.default()}
                  </div>

                  {
                    footer.value && <div class="sa-dialog-foot" style={{ justifyContent: props.footerAlign || 'center' }}>
                      {slots.footer()}
                      {!!props.confirmButton && <SaButton onClick={methods.confirm}>{buttonText.value.confirmButtonText}</SaButton>}
                      {!!props.cancelButton && <SaButton mode="plain" onClick={methods.cancel}>{buttonText.value.cancelButtonText}</SaButton>}
                    </div>
                  }
                </div>

              </div>
            ) as any

            if (props.destroyOnClose) {
              return model.value && Content
            } else {
              return <Content v-show={model.value} />
            }
          })()}

        </Transition>
      </Teleport>
    }
  }
})

export default SaDialog