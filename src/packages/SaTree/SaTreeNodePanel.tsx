import { computed, reactive, VNode, watch } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTree.scss'
import SaIcon from "../SaIcon/SaIcon";
import SaCollapseGroup from '../SaCollapseGroup/SaCollapseGroup'
import SaCollapse from '../SaCollapse/SaCollapse'
import { RootTreeItem, TreeItem } from "./cros/type";
import { useTree } from "./cros/use/useTree";
import { TreeProps } from "./cros/use/tree.util";
import SaTree from './SaTree'
import { classname } from "src/hooks";

// 下一步实现点击展开child,  ---- 想办法把child 和 parent关联起来， 可以利用绑定key作为关联，不该给用户知道的关联
// 一个内部操作的数据rootData，可以对外抛给用户的data

export const SaTreeNodePanel = designComponent({
  name: 'SaTreeNodePanel',

  props: TreeProps,
  setup({ props }) {

    const parent = SaTree.use.inject()

    const { treeData, flatTreeData } = useTree<TreeItem>({ props } as any)

    const formatData = computed(() => props.isChild ? props.data : treeData)

    const collpaseLimit = computed(() => flatTreeData.length)

    const state = {
      collpases: []
    }

    const methods = {

      collpaseClasses: (val: string) => computed(() => classname([
        'sa-collapse-tree',
        {
          'sa-collapse-tree__highlight': val === parent.state.current && !!props.highlightCurrent
        }
      ]))
    }

    return {
      render: () => {
        const labelContent = (
          level: number,
          content: string | (() => VNode),
          extendEl: () => VNode,
          extendClsses?: () => String[],
          handleFun?: Record<string, () => void>
        ) => (
          <div
            class={"sa-tree-node-content " + extendClsses?.().join(' ')}
            style={{ paddingLeft: `${(level - 1) * 18}px` }}
            {...handleFun}
          >
            {extendEl()}
            <span>{content}</span>
          </div>
        )

        return (
          <>
            {
              formatData.value.map((c: RootTreeItem) => (
                <div class="sa-tree-node" >
                  {!!c.childrens && c.childrens.length > 0 ? (
                    <SaCollapseGroup
                      defaultClass={false}
                      limit={props.accordion ? 1 : collpaseLimit.value}
                      {...{
                        onChangeOpen: parent.handler.setCurrent,
                        onChangeClose: parent.handler.collapseClose,
                        onClick: parent.handler.setCurrent
                      }}
                    >
                      <SaCollapse v-slots={{
                        head: () => labelContent(
                          c.level,
                          c.label,
                          () => <SaIcon icon="el-icon-caret-right" />
                        )
                      }}
                        // @ts-ignore
                        customClass={methods.collpaseClasses(c[props.nodeKey] || c['_id']).value}
                        // @ts-ignore
                        value={c[props.nodeKey] || c['_id']}
                      >
                        <SaTreeNodePanel {...{ ...props, data: c.childrens }} isChild />
                      </SaCollapse>
                    </SaCollapseGroup>
                  ) : labelContent(
                    c.level,
                    c.label,
                    () => <i style={{ width: '16px', height: '16px', display: 'inline-block' }}></i>,
                    // @ts-ignore
                    () => ((c[props.nodeKey] || c['_id']) === parent.state.current) && !!props.highlightCurrent ? ['sa-collapse-tree__highlight'] : [],
                    {
                      // @ts-ignore
                      onClick: () => parent.handler.setCurrent(c[props.nodeKey] || c['_id'])
                    }
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