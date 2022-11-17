import { VNode } from "vue";

export interface TreeItem {
  label: string | (() => VNode),
  disabled: boolean,
  childrens: TreeItems,
  level: number
}

export type TreeItems = TreeItem[]

export type ReWriteTreeTime = Omit<TreeItem, 'label'> & {
  label: string
}