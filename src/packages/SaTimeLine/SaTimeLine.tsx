import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTimeLine.scss'

import { useRefs } from "src/hooks";
import { computed, VNode, VNodeChild } from "vue";
import { typeOf } from "js-hodgepodge";

export const SaTimeLine = designComponent({

  name: 'SaTimeLine',

  props: {
    reverse: { type: Boolean, defalut: false }  // 指定节点排序方向，默认为正序
  },

  slots: ['default'],

  setup({ props, slots }) {

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

    const childs = computed(() => {
      if (!slots.default.isExist()) {
        return () => null
      }

      return props.reverse ? methods.flashback : methods.poSequence
    })


    const methods = {
      poSequence: (): VNodeChild => {
        const childNodes = methods.getChilds()
        
        return childNodes.sort((a: any, b: any) => methods.timeStampForamt(a.props.timestamp) - methods.timeStampForamt(b.props.timestamp))
      },

      timeStampForamt: (data: string | number): number => new Date(data).getTime(),

      getChilds() {
        const childNodes = slots.default() as any[] || []
        return childNodes.length === 1 && typeOf(childNodes[0].type) === null ? childNodes[0].children : childNodes
      },

      flashback: (): VNodeChild => {
        const childNodes = methods.getChilds()
        return childNodes.sort((a: any, b: any) => methods.timeStampForamt(b.props.timestamp) - methods.timeStampForamt(a.props.timestamp))
      },
    }

    return {

      refer: {
        refs
      },

      render: () => <div class="sa-timeline" ref={onRef.el}>
        {childs.value()}
      </div>
    }
  }
})

export default SaTimeLine