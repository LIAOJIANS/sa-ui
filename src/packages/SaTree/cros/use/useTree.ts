import { computed, reactive, VNode } from "vue"
import { decopy } from 'js-hodgepodge'

import { TreeItems } from "../type"

export function useTree<Node extends {}>({
  props
}: {
  props: {
    data: TreeItems,
    props: Record<string, string> | undefined
  }
}) {
  
  const filds = reactive({
    label: computed(() => props.props?.label || 'label'),
    childrens: computed(() => props.props?.childrens || 'childrens')
  })

  // const rootData = {
  //   []
  // }

  const handle = {
    toggleExpand: (keyOrNode: string | VNode) => {

    }
  }

  const methods = { 
    treeDataFomrat: () => {
      let level = 1
      let oldLevel = 0
      const treeData = decopy(props.data)
      const recursion = (data: TreeItems) => {

        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.level = level

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

    fattenData: (data: TreeItems, list: TreeItems) => {
      const treeData = list
      data.forEach(c => {
        treeData.push(c)
        if (c.childrens?.length > 0) {
          methods.fattenData(c.childrens, treeData)
        }
      })

      return treeData
    }
  }

  return {
    methods,
    flatTreeData: methods.fattenData(methods.treeDataFomrat(), []), // 扁平化的tree数据
    treeData: methods.treeDataFomrat()
  }
}