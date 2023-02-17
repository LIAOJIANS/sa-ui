import { computed, reactive, VNode } from "vue"
import { decopy, typeOf, unique } from 'js-hodgepodge'

import { DataProps, RootTreeItem, TreeCheckbox, TreeItems } from "../type"
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

  const handler = {
    toggleExpand: (keyOrNode: string | VNode) => { 

    }
  }

  const methods = { 
    treeDataFomrat: (): RootTreeItem[] => {

      let level = 1
      let oldLevel = 0
      const treeData = decopy(props.data)
      const recursion = (data: RootTreeItem[], parentId: string | number) => {

        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.level = level
          item._id = methods.randomId() + methods.randomId()
          item.isCheck = !item.isCheck ? CheckboxStatus.uncheck : item.isCheck
          item.parentId = parentId
          
          if(methods.isCustomProps()) { // 自定义属性
            // @ts-ignore
            item.label = item[filds.label]
            // @ts-ignore
            item.childrens = item[filds.childrens]
          }

          if (item.childrens && item.childrens.length > 0) {
            level += 1
            recursion(item.childrens, item._id)
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
      
      const key = methods.getTreeKey()
      const recursion = (data: RootTreeItem[]) => {
        for(let i = 0; i < data.length; i++) {
          const item = data[i]
          const keyNode = item[key] as string

          if(!(key in item)) {
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

    setCheckboxStatus: (
      status: TreeCheckbox | boolean | null
    ) => {
      console.log(status);
      
      // typeOf(status) === 'boolean' ? status ? CheckboxStatus.check : CheckboxStatus.uncheck : status

      // return props.
    },

    getCheckboxStauses: (node: RootTreeItem, status: TreeCheckbox) => {

      let attr = {}
      
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
      const nodeKey = methods.getTreeKey()

      if(!node.childrens || node.childrens.length === 0) {
        return keys
      }
      
      const recursion = (childs: RootTreeItem[]) => {

        for(let i = 0; i < childs.length; i++) {
          const item = childs[i]

          keys.push(item[nodeKey] as string)
          
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
      const nodeKey = methods.getTreeKey()
      const flatTreeData = methods.fattenData(state.rootData, [])
      let statusPool: { key?: string, status?: string } = {} // 状态缓存池，纪录上一次nodeChild的状态 取巧不更新子状态
      
      const recursion = (parent: RootTreeItem) => {
        
        const parentId = parent.parentId

        const parentData = flatTreeData.find(c => c[nodeKey] === parentId)!

        const parentKey = parentData[nodeKey] as string
        
        // 判断childs是否一项，一项则为true，不为一项则看其他项的状态
        if(parentData.childrens.length === 1) {
          attr = {
            ...attr,
            [parentKey]: {isCheck: status}
          }
        } else {
          // 如果当前状态为check，其他状态为uncheck/minus则parent为minus，其他状态为check则为check，
          // 如果当前状态为uncheck，其他状态为check/minus则parent为minus，其他状态为uncheck则为uncheck
          
          const childStatus = parentData.childrens.map(c => c[nodeKey] === statusPool.key ? statusPool.status : c.isCheck) as any[]
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
    }
  }

  if(!props.isChild || !cache) {

    state.rootData = methods.treeDataFomrat()
  }

  return {
    methods,
    flatTreeData: methods.fattenData(state.rootData, []), // 扁平化的tree数据
    treeData: state.rootData,
    getTreeKey: methods.getTreeKey
  }
}
