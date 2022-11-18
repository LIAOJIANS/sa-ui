import { TreeItems } from "../type"

export function useTree({
  props
}: {
  props: {
    data: TreeItems
  }
}) {

  const methods = {
    treeDataFomrat: () => {
      let level = 1
      let oldLevel = 0
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
      recursion(props.data)
      return props.data
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
    treeData: methods.fattenData(methods.treeDataFomrat(), [])
  }
}