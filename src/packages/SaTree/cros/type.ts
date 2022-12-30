import { VNode } from "vue";

export interface TreeItem {
  label: string | (() => VNode),
  disabled: boolean,
  childrens: TreeItems,
  level: number,                        // 层级
  expand: boolean,                      // 是否展开
  key: string                          
}

export type TreeItems = TreeItem[]

export type ReWriteTreeTime = Omit<TreeItem, 'label'> & {
  label: string
}

export interface RootTreeItem extends TreeItem {
  id: string,
  parentId: string
}
