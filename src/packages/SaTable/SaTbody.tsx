import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, ref, watch } from "vue";
import SaTable from './SaTable'

const SaTbody = designComponent({
  props: {
    layout: { type: Object },
    clickIndex: { type: Number },
    drag: { type: Boolean },
  },

  slots: ['default'],

  emits: {

  },

  setup({ props, slots }) {

    let clickIndex = ref<number>(-1)

    const table = SaTable.use.inject(null)!

    const layoutLen = computed(() => new Array(props.layout?.trLen || 0).fill(''))

    const handler = {
      handleClick: (e: MouseEvent, i: number) => {
        e.stopPropagation()

        if (table.props.highlightCurrentRow) {
          clickIndex.value = i
        }

        table.handler.handleRowClick(i)
      },
      
      dragstart: (e: DragEvent, i: number) => {
        // console.log('dragstart',e, i);
        
        table.handler.handleDragstart(i, e)
      },

      drag: (e: DragEvent, i: number) => {
        // console.log('drag',e, i);
        
        table.handler.handleDrag(i, e)
      },
      
      dragend: (e: DragEvent, i: number) => {
        // console.log('dragend',e, i);
        
      },

      dragenter: (e: DragEvent, i: number) => {
        // console.log('dragenter',e);
        
        // console.log(i)
      },

      dragOver: (e: DragEvent, i: number) => {

        e.preventDefault()

        table.handler.handleDrag(i, e)
      },

      dragleave: (e: DragEvent, i: number) => {
        
        table.handler.handleDragleave(i, e) // 暴露事件
      },
    }

    watch(() => props.clickIndex, () => clickIndex.value = props.clickIndex!)

    return {
      refer: {
        
      },
      render: () => (

        <tbody>
          {
            layoutLen.value.map((c, i) => (
              <tr draggable={props.drag} class={
                `sa-table-column--hover${clickIndex.value === i ?
                  ' sa-table-column--click' :
                  ''
                }${(i % 2 !== 0 && table.props.zebra) ?
                  ' sa-table-cell--zebra' :
                  ''
                }`
              }
                onClick={(e) => handler.handleClick(e, i)}
                onDragstart={(e) => handler.dragstart(e, i)}
                onDragend={(e) => handler.dragend(e, i)}
                onDragenter={(e) => handler.dragenter(e, i)}
                onDragover={(e) => handler.dragOver(e, i)}
                onDragleave={(e) => handler.dragleave(e, i)}
                onDrag={(e) => handler.drag(e, i)}
              >
                {slots.default()}
              </tr>
            ))
          }
        </tbody>
      )
    }
  }
})

export default SaTbody