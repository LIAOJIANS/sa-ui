import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus } from "src/hooks";
import { onMounted, watch } from "vue";
import { onDeactivated } from "vue";
import { reactive } from "vue";
import { RootTreeItem, TreeCheckbox, TreeItem } from "./cros/type";
import { TreeProps } from "./cros/use/tree.util";
import { useTree } from "./cros/use/useTree";
import SaTreeNodePanel from "./SaTreeNodePanel";

export const SaTree = designComponent({

  name: 'sa-tree',

  props: TreeProps,

  provideRefer: true,

  emits: {
    getCheckedKeys: (keys: string[]) => true,                         // 返回所有选中的keys，必须设置node-key
    getCurrentNode: (node: RootTreeItem) => true,                     //  获取当前选中的节点，没有选中则返回null

    setCheckedKeys: (keys: string[], isCheck: boolean) => true,       // 后续暴露的方法
    setChecked: (key: string, isCheck: boolean) => true,              // 后续暴露的方法
  },

  setup({ props, event: { emit } }) {

    const { treeData, methods } = useTree<TreeItem>({ props } as any)

    const state = reactive({
      treeExpands: [],
      current: ''
    } as {
      treeExpands: string[],
      current: string
    })

    const handler = {
      collapseOpen: (item: string) => !state.treeExpands.includes(item) && state.treeExpands.push(item),

      collapseClose: (item: string) => {
        const index = state.treeExpands.findIndex(c => c === item)
        
        index > -1 && state.treeExpands.splice(index, 1)
      },

      setCurrent: (item: string) => (state.current = item),

      setChecked: (val: TreeCheckbox, node: RootTreeItem) => {
        node.isCheck = val

        emit.getCurrentNode({
          ...node,
          isCheck: val === CheckboxStatus.check || null
        })

        methods.setTreeItemAttr([node[methods.getTreeKey()] as string], { isCheck: val === CheckboxStatus.check || null })

        
        console.log(treeData); // 响应没生效
      }
    }

    onMounted(() => {
      document.querySelector('body')?.addEventListener('click', (e: MouseEvent) => {
        if(state.current) {
          state.current = ''
        }
      })
    })

    onDeactivated(() => document.querySelector('body')?.removeEventListener('click', () => {}))

    return {
      refer: {
        state,
        handler
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