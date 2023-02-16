import { CheckboxStatus } from "src/hooks";
import { VNode } from "vue";

export interface TreeItem {
  label: string | (() => VNode),
  disabled: boolean,
  childrens: TreeItems,
  level: number,                        // 层级
  expand: boolean,                      // 是否展开
  key: string                          
}

export interface DataProps {
  label: string,
  childrens: string
}

export type TreeItems = TreeItem[]

export type TreeCheckbox = keyof typeof CheckboxStatus   //  内部树选中状态类型

export type ReWriteTreeTime = Omit<TreeItem, 'label'> & {   // 重写label类型
  label: string
}

export interface RootTreeItem extends TreeItem {
  _id?: string,
  parentId?: string,
  isCheck?: TreeCheckbox | boolean | null
}
