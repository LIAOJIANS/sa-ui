import { computed, reactive, VNode, watch } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTree.scss'
import SaIcon from "../SaIcon/SaIcon";
import SaCollapseGroup from '../SaCollapseGroup/SaCollapseGroup'
import SaCollapse from '../SaCollapse/SaCollapse'
import { ReWriteTreeTime, TreeItem } from "./cros/type";
import { useTree } from "./cros/use/useTree";
import { TreeProps } from "./cros/use/tree.util";

// 下一步实现点击展开child,  ---- 想办法把child 和 parent关联起来， 可以利用绑定key作为关联，不该给用户知道的关联
// 一个内部操作的数据rootData，可以对外抛给用户的data

export const SaTreeNodePanel = designComponent({
  name: 'SaTreeNodePanel',

  props: TreeProps,
  setup({ props }) {

    const collapseGroup = SaCollapseGroup.use.inject()

    const state = reactive({
      openVal: ''
    })

    const { treeData, flatTreeData } = useTree<TreeItem>({ props } as any)

    const formatData = computed(() => props.isChild ? props.data : treeData)
    
    const collpaseLimit = computed(() => flatTreeData.length)
    const isOpen = computed(() => {
      if (!!collapseGroup) {
        return collapseGroup.utils.isOpen(state.openVal)
      } else {
        return false
      }
    })

    watch(() => state.openVal, () => {
      console.log(
        state.openVal, isOpen.value);
      

    })

    // console.log(collapseGroup);
    return {
      render: () => {
        const labelContent = (
          level: number,
          content: string | (() => VNode),
          extendEl: () => VNode
        ) => (
          <div class="sa-tree-node-content" style={{ paddingLeft: `${(level - 1) * 18}px` }}>
            {extendEl()}
            <span>{content}</span>
          </div>
        )

        return (
          <>
            {
              formatData.value.map((c: TreeItem) => (
                <div class="sa-tree-node" >
                  {!!c.childrens && c.childrens.length > 0 ? (
                    <SaCollapseGroup 
                      v-model={ state.openVal } 
                      defaultClass={false} 
                      limit={ props.accordion ? 1 : collpaseLimit.value }
                    >
                      <SaCollapse v-slots={{
                        head: () => labelContent(
                          c.level,
                          c.label,
                          () => <SaIcon icon="el-icon-caret-right" />
                        )
                      }} 
                      customClass='sa-collapse-tree'
                      // @ts-ignore
                      value={ c[props.nodeKey] }
                    >
                        <SaTreeNodePanel {...{ ...props, data: c.childrens }} isChild />
                      </SaCollapse>
                   </SaCollapseGroup>
                  ) : labelContent(
                    c.level,
                    c.label,
                    () => <i style={{ width: '16px', height: '16px', display: 'inline-block' }}></i>
                  )}
                </div>)
              )
            }
          </>
        )
      }
    }
  }
})

export default SaTreeNodePanel