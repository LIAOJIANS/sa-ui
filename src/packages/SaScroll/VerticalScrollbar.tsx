

import { SaScroll } from "./SaScroll";
import SaTooltip from "../SaTooltip/SaTooltip";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, reactive } from "vue";
import { disabledUserSelect, enableUserSelect, unit, useStyles } from "src/hooks";

export const VerticalScrollbar = designComponent({
  name: 'VerticalScrollbar',
  props: {
    tooltip: { type: String },
  },
  setup({ props }) {

    const scroll = SaScroll.use.inject()

    const dragState = {
      top: 0,
      clientY: 0,
    }

    const state = reactive({
      scrollTop: 0,
    })

    const height = computed(() => {
      return scroll.state.contentHeight > scroll.state.hostHeight ?
        (scroll.state.hostHeight * scroll.state.hostHeight / scroll.state.contentHeight)
        : 0
    })
    const top = computed(() => {
      return (scroll.state.hostHeight - height.value) * state.scrollTop / (scroll.state.contentHeight - scroll.state.hostHeight)
    })

    const styles = useStyles(() => {
      return {
        height: unit(height.value),
        width: unit(scroll.targetScrollbarSize.value),
        top: unit(top.value),
        backgroundColor: scroll.props.scrollbarColor,
      }
    })

    const handler = {
      onScroll: (e: Event) => {
        state.scrollTop = (e.target as HTMLElement).scrollTop
      },
      
      onMousedown: (e: MouseEvent) => {
        scroll.freezeState.isDragging = true
        dragState.top = top.value
        dragState.clientY = e.clientY
        document.addEventListener('mousemove', handler.onMousemove)
        document.addEventListener('mouseup', handler.onMouseup)
        disabledUserSelect()
      },

      onMousemove: (e: MouseEvent) => {
        let deltaY = e.clientY - dragState.clientY
        let top = dragState.top + deltaY
        let scrollTop = top * (scroll.state.contentHeight - scroll.state.hostHeight) / (scroll.state.hostHeight - height.value)
        scrollTop = Math.max(0, Math.min(scrollTop, scroll.state.contentHeight - scroll.state.hostHeight))
        if (!scroll.props.scrollAfterDragEnd) {
          scroll.refs.wrapper!.scrollTop = scrollTop
        } else {
          /*滚动条发生位移，但是内容scrollTop暂时不变*/
          state.scrollTop = scrollTop
        }
      },

      onMouseup: (e: MouseEvent) => {
        scroll.freezeState.isDragging = false
        document.removeEventListener('mousemove', handler.onMousemove)
        document.removeEventListener('mouseup', handler.onMouseup)
        enableUserSelect()

        if (scroll.props.scrollAfterDragEnd) {
          let deltaY = e.clientY - dragState.clientY
          let top = dragState.top + deltaY
          scroll.refs.wrapper!.scrollTop = top * (scroll.state.contentHeight - scroll.state.hostHeight) / (scroll.state.hostHeight - height.value)
        }
      },
    }

    scroll.on.onScroll(handler.onScroll)

    return {
      render: () => {
        let content = <div class="sa-vertical-scrollbar" style={styles.value} onMousedown={handler.onMousedown} />
        if (!!props.tooltip) { content = (<SaTooltip message={props.tooltip}>{content}</SaTooltip>) }
        return (
          <div class="sa-vertical-scrollbar-wrapper">
            {content}
          </div>
        )
      }
    }
  },
})


export default VerticalScrollbar