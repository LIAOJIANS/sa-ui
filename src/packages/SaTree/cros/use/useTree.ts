import { computed, reactive, VNode } from "vue"
import { decopy } from 'js-hodgepodge'

import { DataProps, RootTreeItem, TreeItems } from "../type"

export function useTree<Node extends {}>({
  props
}: {
  props: {
    data: TreeItems,
    props: DataProps | undefined,
    nodeKey: string | null
  }
}) {
  
  const filds = reactive({
    label: computed(() => props.props?.label || 'label').value,
    childrens: computed(() => props.props?.childrens || 'childrens').value
  } as {
    label: string,
    childrens: string
  })

  const state = reactive({
    rootData: []
  } as {
    rootData: RootTreeItem[]
  })

  const handler = {
    toggleExpand: (keyOrNode: string | VNode) => { 

    }
  }

  const methods = { 
    treeDataFomrat: (): RootTreeItem[] => {
      let level = 1
      let oldLevel = 0
      const treeData = decopy(props.data)
      const recursion = (data: RootTreeItem[]) => {

        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.level = level
          item._id = methods.randomId() + methods.randomId() 
          
          if(methods.isCustomProps()) { // 自定义属性
            // @ts-ignore
            item.label = item[filds.label]
            // @ts-ignore
            item.childrens = item[filds.childrens]
          }

          if (item.childrens && item.childrens.length > 0) {
            level += 1
            recursion(item.childrens)
          }

          oldLevel = level - 1
        }

        level = oldLevel
      }
      recursion(treeData)
      return treeData
    },

    isCustomProps: () => props.props?.label && props.props?.childrens,

    fattenData: (data: TreeItems, list: TreeItems) => {
      const treeData = list
      data.forEach(c => {
        treeData.push(c)
        if (c.childrens?.length > 0) {
          methods.fattenData(c.childrens, treeData)
        }
      })

      return treeData
    },

    randomId: () => Math.random().toString(16).slice(2, 40),

    setTreeItemAttr: (keys: string[], attr: any) => {
      
      const nodeKey = methods.getTreeKey()
      const recursion = (data: RootTreeItem[]) => {
        for(let i = 0; i < data.length; i++) {
          const item = data[i]

          if(!(nodeKey in item)) {
            return
          }

          if(keys.indexOf(item[nodeKey] as any) > -1) {
            data[i] = {
              ...item,
              ...attr
            }
          }

          if(!!item.childrens && item.childrens.length > 0) {
            recursion(item.childrens)
          }
        }
      }

      recursion(state.rootData)
    },

    getTreeKey: (): keyof RootTreeItem => props.nodeKey || '_id' as any
  }

  state.rootData = methods.treeDataFomrat()

  return {
    methods,
    flatTreeData: methods.fattenData(state.rootData, []), // 扁平化的tree数据
    treeData: state.rootData,
    getTreeKey: methods.getTreeKey
  }
}
