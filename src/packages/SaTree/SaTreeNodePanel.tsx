import { computed, reactive, VNode, ref, watch } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTree.scss'
import SaIcon from "../SaIcon/SaIcon";
import SaCollapseGroup from '../SaCollapseGroup/SaCollapseGroup'
import SaCollapse from '../SaCollapse/SaCollapse'
import SaTree from './SaTree'
import SaCheckbox from '../SaCheckbox/SaCheckbox'

import { RootTreeItem, TreeCheckbox, TreeItem } from "./cros/type";
import { useTree } from "./cros/use/useTree";
import { TreeProps } from "./cros/use/tree.util";
import { classname } from "src/hooks";

// 下一步实现点击展开child,  ---- 想办法把child 和 parent关联起来， 可以利用绑定key作为关联，不该给用户知道的关联
// 一个内部操作的数据rootData，可以对外抛给用户的data

export const SaTreeNodePanel = designComponent({
  name: 'SaTreeNodePanel',

  props: TreeProps,
  setup({ props }) {

    const parent = SaTree.use.inject()

    const { flatTreeData, nodeKey } = useTree<TreeItem>({ props, cache: true } as any)

    const formatData = computed((): RootTreeItem[] => props.data)

    const collpaseLimit = computed(() => props.defaultExpandAll ? flatTreeData.length : props.accordion ? 1 : flatTreeData.length)

    const state = reactive({
      collapses: props.defaultExpandAll ? formatData.value.map(c => c[nodeKey.value]) : []
    })

    watch(() => state.collapses, val => {
      console.log(val);

    })

    const methods = {

      collpaseClasses: (val: string) => computed(() => classname([
        'sa-collapse-tree',
        {
          'sa-collapse-tree__highlight': methods.isHighlight(val)
        }
      ])),


      isHighlight: (val: string) => {
        console.log('child', val);
        console.log('parent', parent.state.current);

        return (val === parent.state.current && !!props.highlightCurrent)
      }
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
            class={"sa-tree-node-content " + (extendClsses?.().join(' ') || '')}
            style={{ paddingLeft: `${(level - 1) * 18}px` }}
            {...handleFun}
          >
            {extendEl()}
            <span> {typeof content === 'function' ? content() : content}</span>
          </div>
        )

        const hasCheckLabel = (c: RootTreeItem) => (
          <SaCollapse v-slots={{
            head: () => labelContent(
              c.level,
              () => (
                props.checkbox ?
                  <SaCheckbox
                    label={c.label}
                    checkboxForAll
                    checkStatus={c.isCheck}
                    onChangeStatus={(e: TreeCheckbox) => parent.handler.setChecked(e, c)}
                  /> : <>{c.label}</>
              ),
              () => <SaIcon icon="el-icon-caret-right" />
            )
          }}
            // @ts-ignore
            customClass={methods.collpaseClasses(c[nodeKey.value]).value}
            value={c[nodeKey.value]}
          >
            <SaTreeNodePanel {...{ ...props, data: c.childrens }} isChild />
          </SaCollapse>
        )

        return (
          <>
            <SaCollapseGroup
              v-model={state.collapses}
              defaultClass={false}
              limit={collpaseLimit.value}
              {...{
                onChangeOpen: parent.handler.collapseOpen,
                onChangeClose: parent.handler.collapseClose,
                onClick: parent.handler.setCurrent
              }}
            >
              {
                formatData.value.map((c: RootTreeItem) => (
                  <div class="sa-tree-node" >
                    {!!c.childrens && c.childrens.length > 0 ? (
                      // (() => props.checkStrictly ? hasCheckLabel(c) : (
                      //   <SaCheckboxGroup>
                      //  {hasCheckLabel(c)}
                      //   </SaCheckboxGroup>
                      // ))()

                      hasCheckLabel(c)

                    ) : labelContent(
                      c.level,

                      () => (
                        props.checkbox ?
                          <SaCheckbox
                            label={c.label}
                            checkStatus={c.isCheck}
                            onChangeStatus={(e: TreeCheckbox) => parent.handler.setChecked(e, c)}
                          /> : <>{c.label}</>
                      ),
                      () => <i style={{ width: '16px', height: '16px', display: 'inline-block' }}></i>,

                      () => methods.isHighlight(c[nodeKey.value] as string) ? ['sa-collapse-tree__highlight'] : [],
                      {
                        onClick: () => parent.handler.setCurrent(c[nodeKey.value] as string)
                      }
                    )}
                  </div>)
                )
              }

            </SaCollapseGroup>
          </>
        )
      }
    }
  }
})

export default SaTreeNodePanel