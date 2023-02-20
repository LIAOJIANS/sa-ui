import { computed, reactive, VNode } from "vue"
import { decopy, unique } from 'js-hodgepodge'

import { AssociationAttr, DataProps, RootTreeItem, TreeCheckbox, TreeItems } from "../type"
import { CheckboxStatus } from "src/hooks"

export function useTree<Node extends {}>({
  props,
  cache
}: {
  props: {
    data: TreeItems,
    props: DataProps | undefined,
    nodeKey: string | null,
    isChild: boolean | null
  },
  cache?: boolean
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

  const nodeKey = computed(() => methods.getTreeKey())

  const handler = {
    toggleExpand: (keyOrNode: string | VNode) => { 

    }
  }

  const methods = { 
    treeDataFomrat: (): RootTreeItem[] => {

      let level = 1
      let oldLevel = 0
      const treeData = decopy(props.data)
      // const nodeKey = methods.getTreeKey()
      const isCustomProps = methods.isCustomProps()
      const recursion = (data: RootTreeItem[], parentId: string | number) => {

        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.level = level
          item._id = methods.randomId() + methods.randomId()
          item.isCheck = !item.isCheck ? CheckboxStatus.uncheck : item.isCheck
          item.parentId = parentId
          
          if(isCustomProps) { // 自定义属性
            // @ts-ignore
            item.label = item[filds.label]
            // @ts-ignore
            item.childrens = item[filds.childrens]
          }

          if (item.childrens && item.childrens.length > 0) {
            level += 1
            // @ts-ignore
            recursion(item.childrens, item[nodeKey.value])
          }

          oldLevel = level - 1
        }

        level = oldLevel
      }
      recursion(treeData, 1)
      return treeData
    },

    isCustomProps: () => props.props?.label && props.props?.childrens,

    fattenData: (data: RootTreeItem[], list: RootTreeItem[]) => {
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
      
      const recursion = (data: RootTreeItem[]) => {
        for(let i = 0; i < data.length; i++) {
          const item = data[i]
          const keyNode = item[nodeKey.value] as string

          if(!(nodeKey.value in item)) {
            return
          }

          if(keys.indexOf(keyNode) > -1) {
            data[i] = {
              ...item,
              ...attr[keyNode as string]
            }
          }

          if(!!item.childrens && item.childrens.length > 0) {
            recursion(item.childrens)
          }
        }
      }

      recursion(state.rootData)
    },

    getTreeKey: (): keyof RootTreeItem => props.nodeKey || '_id' as any,

    associationSelection: (
      keys: string[],
      status: TreeCheckbox
    ): { keys: string[], attr: AssociationAttr } => {

      let singleBranch = new Map()
      let attr: AssociationAttr = {}
      const flatTreeData =  methods.fattenData(state.rootData, [])

      for(let i = 0; i < keys.length; i++) {
        const item = flatTreeData.find((c: RootTreeItem) => c[nodeKey.value] === keys[i])!

        singleBranch.set(
          item.parentId == 1 ? i + 1 : item!.parentId,
          item
        )
      }

      singleBranch.forEach(v => {
        attr = {
          ...attr,
          ...methods.getCheckboxStauses(v, status)
        }
      })
      
      return {
        keys: Object.keys(attr),
        attr
      }
    },

    getCheckboxStauses: (node: RootTreeItem, status: TreeCheckbox) => {

      let attr = {}

      if(node.isCheck === status) {  // 防止设置重复状态浪费性能
        return {}
      }
      
      const downKeys = methods.findDownGetNodeKeys(node)
      downKeys.forEach(c => {
        attr = {...attr, [c]: { isCheck : status }}
      })

      if(node.parentId === 1) {
        return attr
      }

      const upAttr = methods.findUpGetNodeKeys(node, status)

      return {
        ...attr,
        ...upAttr
      }
    },

    findDownGetNodeKeys: (node: RootTreeItem): string[] => { // 向下查找
      let keys: string[] = []
      // const nodeKey = methods.getTreeKey()

      if(!node.childrens || node.childrens.length === 0) {
        return keys
      }
      
      const recursion = (childs: RootTreeItem[]) => {

        for(let i = 0; i < childs.length; i++) {
          const item = childs[i]

          keys.push(item[nodeKey.value] as string)
          
          if(item.childrens && item.childrens.length > 0) {
            recursion(item.childrens)
          }
        }

      }

      recursion(node.childrens)

      return keys
    },

    findUpGetNodeKeys: (node: RootTreeItem, status: TreeCheckbox) => {   // 再找向上, 可分为两大类，选中与否（ture/false） / 半选（minus）
      let attr = {}
      // const nodeKey = methods.getTreeKey()
      const flatTreeData = methods.fattenData(state.rootData, [])
      let statusPool: { key?: string, status?: string } = {} // 状态缓存池，纪录上一次nodeChild的状态 取巧不更新子状态
      
      const recursion = (parent: RootTreeItem) => {
        
        const parentId = parent.parentId

        const parentData = flatTreeData.find(c => c[nodeKey.value] === parentId)!
        
        const parentKey = parentData[nodeKey.value] as string
        
        // 判断childs是否一项，一项则为true，不为一项则看其他项的状态
        if(parentData.childrens.length === 1) {
          attr = {
            ...attr,
            [parentKey]: {isCheck: status}
          }
        } else {
          // 如果当前状态为check，其他状态为uncheck/minus则parent为minus，其他状态为check则为check，
          // 如果当前状态为uncheck，其他状态为check/minus则parent为minus，其他状态为uncheck则为uncheck
          
          const childStatus = parentData.childrens.map(c => c[nodeKey.value] === statusPool.key ? statusPool.status : c.isCheck) as any[]
          const uniChildStatus = unique(childStatus) 

          const checkStatus = childStatus.indexOf(CheckboxStatus.minus) > -1 || uniChildStatus.length > 1 ? CheckboxStatus.minus : status

          attr = {
            ...attr,
            [parentKey]: { isCheck: checkStatus}
          }

          statusPool = {
            key: parentKey,
            status: checkStatus
          }
        }

        if(parentData.parentId === 1) {
          return
        }

        recursion(parentData)
      }

      recursion(node)

      return attr
    },

    findNoedByNodeKeys: (key: string) => {
      const data = methods.fattenData(state.rootData, [])

      return data.find(c => c[nodeKey.value] === key)
    }
  }

  if(!props.isChild || !cache) {

    state.rootData = methods.treeDataFomrat()
  }

  return {
    methods,
    flatTreeData: methods.fattenData(state.rootData, []), // 扁平化的tree数据,调用前定义会失去响应
    treeData: state.rootData,
    nodeKey
  }
}
