import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus } from "src/hooks";
import { computed, onMounted } from "vue";
import { onDeactivated } from "vue";
import { reactive } from "vue";
import { AssociationAttr, RootTreeItem, TreeCheckbox, TreeItem } from "./cros/type";
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

    const nodeKey = computed(() => methods.getTreeKey())

    const handler = {
      collapseOpen: (item: string) => !state.treeExpands.includes(item) && state.treeExpands.push(item),

      collapseClose: (item: string) => {
        const index = state.treeExpands.findIndex(c => c === item)

        index > -1 && state.treeExpands.splice(index, 1)
      },

      setCurrent: (item: string, e?: MouseEvent) => {
        if(e) {
          e.stopPropagation()
        }
        state.current = item
      },

      setChecked: (val: TreeCheckbox, node: RootTreeItem) => { // 点击只有两种状态（check / uncheck）

        node.isCheck = val  // 利用浅拷贝特性

        if (props.checkStrictly) {  // 选中关联父子

          let keys = []
          let attr: any = {}

          // 选中当前节点，如果存在子节点则子节点全部选中，如果存在父节点，则判断当前父节点所属的子节点是否全部选中，否则半选，是则全选
          // 如果是顶节点则子节点全部选中
          // 如果childrens 不存在或者length 为0则 往上修改父节点的状态

          // 获取需要修改状态的节点keys
          attr = methods.getCheckboxStauses(node, val)

          // 获取需要修改节点状态对应的key对象
          keys = Object.keys(attr)

          methods.setTreeItemAttr(keys, attr)
        }

        emit.getCurrentNode({ // 派发事件
          ...node,
          isCheck: val
        })

      }
    }

    const insideMethods = {
      checkAll: () => insideMethods.setCheckStatusByNode(treeData, CheckboxStatus.check),

      reverseSelection: () => {
        const fattenData = methods.fattenData(treeData, [])
        const checkMap = new Map()

        fattenData
          .forEach((c: RootTreeItem) => {
            if (c.isCheck === CheckboxStatus.check) {
              checkMap.set(
                c[nodeKey.value],
                { [c[nodeKey.value] as string]: { isCheck: CheckboxStatus.uncheck } }
              )

            } else if (c.isCheck === CheckboxStatus.uncheck) {

              checkMap.set(
                c[nodeKey.value],
                { [c[nodeKey.value] as string]: { isCheck: CheckboxStatus.check } }
              )
            }
          })


        const consolidateData = () => {
          let keys: string[] = []
          let attr = {}
          checkMap.forEach((v, k) => {
            keys.push(k)
            attr = {
              ...attr,
              ...v
            }
          })

          return {
            keys,
            attr
          }
        }

        const { keys, attr } = consolidateData()

        methods
          .setTreeItemAttr(keys, attr)
      },

      setCheckStatusByNodeKey: (keys: string[], status: TreeCheckbox) => {

        let attr: AssociationAttr = {}

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          attr[key] = {
            isCheck: status
          }
        }

        // 如果选中模式是上下关联状态则过滤出每个分支下的level最大值
        if (props.checkStrictly) {
          const { keys: nodeKeys, attr: treeItem } = methods.associationSelection(keys, status)

          keys = [
            ...keys,
            ...nodeKeys
          ]

          attr = {
            ...attr,
            ...treeItem
          }
        }

        methods
          .setTreeItemAttr(keys, attr)
      },

      setCheckStatusByNode: (nodes: any[], status: TreeCheckbox) => {
        const keys = nodes.map(c => c[nodeKey.value])

        insideMethods
          .setCheckStatusByNodeKey(keys, status)
      },

      getCheckStatusKey: () => {
        if (!props.nodeKey) {
          console.error('Please set the nodeKey, or you will get the internal key (_id)!!!!')
        }

        return methods
          .fattenData(treeData, [])
          .filter(c => c.isCheck === CheckboxStatus.check)
          .map(c => c[nodeKey.value])
      },

      getCheckStatusNode: () => methods.fattenData(treeData, []).filter(c => c.isCheck === CheckboxStatus.check)
    }

    onMounted(() => {
      document
        .querySelector('body')
        ?.addEventListener('click', (e: MouseEvent) => {
          if (state.current) {
            state.current = ''
          }
        })
    })

    onDeactivated(() => document.querySelector('body')?.removeEventListener('click', () => { }))

    return {
      refer: {
        state,
        handler,
        methods: {
          ...insideMethods
        }
      },

      render: () => (
        <div class="sa-tree">
          <SaTreeNodePanel
            {...{ ...props, isChild: true, data: treeData }}
          />
        </div>
      )
    }
  }
})

export default SaTree