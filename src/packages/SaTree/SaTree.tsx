import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType } from "vue";
import { ReWriteTreeTime, TreeItem, TreeItems } from "./cros/type";

export const SaTree = designComponent({
  name: 'SaTree',

  props: {
    data: { type: Array as PropType<TreeItems>, default: [] },
    props: { type: Object as PropType<ReWriteTreeTime> },
    level: { type: Number }
  },
  setup({ props }) {

    const formatData = computed(() => !!props.level ? props.data : methods.treeDataFomrat(props.data))

    const methods = {
      treeDataFomrat: (data: TreeItems) => {
        let level = 1
        const recursion = (data: any) => {

          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            item.level = level
            if (item.childrens && item.childrens.length > 0) {
              level += 1
              recursion(item.childrens)
            }
            level = 1
          }
        }

        recursion(data)

        return data
      }
    }

    return {

      render: () => (
        formatData.value.map((c: TreeItem) => (
          <div style={{ paddingLeft: `${(c.level - 1)*18}px` }}>
            <span>{c.label}</span>
            {c.childrens?.length > 0 && <SaTree {...{ ...props, data: c.childrens }} level={ c.level } />}
          </div>)
        )
      )
    }
  }
})

export default SaTree