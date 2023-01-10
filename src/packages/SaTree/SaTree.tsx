import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { reactive } from "vue";
import { TreeProps } from "./cros/use/tree.util";
import SaTreeNodePanel from "./SaTreeNodePanel";

export const SaTree = designComponent({

  name: 'sa-tree',

  props: TreeProps,

  provideRefer: true,

  setup({ props }) {

    const state = reactive({
      treeExpands: []
    } as {
      treeExpands: string[]
    })

    const methods = {
      collapseOpen: (item: string) => !state.treeExpands.includes(item) && state.treeExpands.push(item),

      collapseClose: (item: string) => {
        const index = state.treeExpands.findIndex(c => c === item)
        
        index > -1 && state.treeExpands.splice(index, 1)
      }
    }

    return {
      refer: {
        state,
        methods
      },

      render: () => (
        <div class="sa-tree">
          <SaTreeNodePanel 
            {...props}
          />
        </div>
      )
    }
  }
})

export default SaTree