import { computed, PropType } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTree.scss'
import SaIcon from "../SaIcon/SaIcon";
import { ReWriteTreeTime, TreeItem, TreeItems } from "./cros/type";
import { useTree } from "./cros/use/useTree";

// 下一步实现点击展开child,  ---- 想办法把child 和 parent关联起来， 可以利用绑定key作为关联，不该给用户知道的关联
// 一个内部操作的数据rootData，可以对外抛给用户的data

export const SaTree = designComponent({
  name: 'SaTree',

  props: {
    data: { type: Array as PropType<TreeItems>, default: [] },
    props: { type: Object as PropType<Record<string, string>> },
    defaultExpandAll: { type: Boolean, default: false }
  },
  setup({ props }) {

    const { methods, treeData } = useTree<TreeItem>({ props } as any)

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