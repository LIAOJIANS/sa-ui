import { computed, PropType } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTree.scss'
import SaIcon from "../SaIcon/SaIcon";
import { ReWriteTreeTime, TreeItem, TreeItems } from "./cros/type";
import { useTree } from "./cros/use/useTree";

// 下一步实现点击展开child,  ---- 想办法把child 和 parent关联起来

export const SaTree = designComponent({
  name: 'SaTree',

  props: {
    data: { type: Array as PropType<TreeItems>, default: [] },
    props: { type: Object as PropType<ReWriteTreeTime> },
    defaultExpandAll: { type: Boolean, default: false }
  },
  setup({ props }) {

    const { methods, treeData } = useTree({ props })

    const formatData = computed(() =>  treeData)
    const isOpenChild = computed(() => 'el-icon-caret-right')

    return {

      render: () => (
        <div class='sa-tree'>
          {
            formatData.value.map((c: TreeItem) => (
              <div class="sa-tree-node" style={{ paddingLeft: `${(c.level - 1) * 18}px` }}>
                <div class="sa-tree-node-content">
                  { !!c.childrens && c.childrens.length > 0 && <SaIcon class="sa-tree-node-icon" icon={isOpenChild.value} /> }
                  <span>{c.label}</span>
                </div>
              </div>)
            )
          }
        </div>
      )
    }
  }
})

export default SaTree