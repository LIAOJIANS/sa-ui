import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { TreeProps } from "./cros/use/tree.util";
import SaTreeNodePanel from "./SaTreeNodePanel";

export const SaTree = designComponent({

  name: 'sa-tree',

  props: TreeProps,

  setup({ props }) {

    return {
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