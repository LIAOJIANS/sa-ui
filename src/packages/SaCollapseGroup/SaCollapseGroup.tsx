import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useModel, useRefs } from "src/hooks";

export const SaCollapseGroup = designComponent({

  name: 'sa-collapse-group',

  props: {
    modelValue: { type: [String, Array] },
    limit: { type: Number, default: 1 }, // 默认展开数量
    disabled: { type: Boolean, default: null },
    defaultClass: { type: Boolean, default: true },
  },
  
  provideRefer: true,
  inheritPropsType: HTMLDivElement,

  emits: {
    onUpdateModelValue: (val: string | string[] | undefined) => true
  },

  slots: ['default'],
  setup({ props, slots, event: { emit } }) {

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

    const model = useModel(() => props.modelValue as string | string[] | undefined, emit.onUpdateModelValue)

    const utils = {
      isOpen: (val: string) => {
        if (!model.value) {
          return
        }

        return typeof model.value === 'string' ? model.value === val : model.value.indexOf(val) > -1
      }
    }

    const handler = {
      clickCollapseTitle: (val: string) => {
        if (props.limit === 1) {
          model.value = model.value == val ? undefined : val
        } else {
          const value = (model.value as string[] | undefined) || []
          const index = value.indexOf(val)
          if (index > -1) {
            value.splice(index, 1)
          } else {
            value.push(val)
            if (value.length > props.limit) {
              value.shift()
            }
          }
          model.value = [...value]
        }
      }
    }

    return {
      refer: {
        refs,
        model,
        utils,
        props,
        handler
      },

      render: () => <div class={ props.defaultClass ? 'sa-collapse-group' : '' } ref={onRef.el}>
        {slots.default()}
      </div>
    }
  }
})


export default SaCollapseGroup