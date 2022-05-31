import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useModel, useStyle, useRefs } from "src/hooks";
import { Teleport, Transition, computed } from "vue";

import './SaDialog.scss'

export const SaDialog = designComponent({
  name: 'sa-dialog',

  props: {
    modelValue: { type: Boolean },
    width: { type: [Number, String] },

    transition: { type: String, default: 'sa-transition-dialog' },
    mask: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: true },                      // 关闭窗口是否销毁实例
  },

  emits: {
    onUpdateModelValue: (val?: boolean) => true,
    onOpen: () => true,
    onClose: () => true,
    onConfirm: () => true,
    onCancel: () => true,
  },

  setup({ props, event: { emit } }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const { onRef } = useRefs({
      el: HTMLDivElement,
      body: HTMLDivElement,
    })

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


    const methods = {
      cancel() {
        methods.hide()
        emit.onCancel()
      },

      async hide() {
        console.log('取消');
      }

    }

    return {
      render: () => <Teleport to=".sa-root-service-container">
        <Transition name={props.transition}>
          {(() => {
            const Content = (
              <div class={classes.value} ref={onRef.el} >
                SaDialog
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