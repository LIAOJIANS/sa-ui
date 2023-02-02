import { PropType } from "vue";
import { DataProps, RootTreeItem, TreeItems } from "../type";

export const TreeProps = {
  data: { type: Array as PropType<TreeItems | RootTreeItem[]>, default: [] },// 树形数据
  props: { type: Object as PropType<DataProps> },                            // 自定义节点结构
  defaultExpandAll: { type: Boolean, default: false },                       // 是否展开所有节点, 优先级高于accordion
  isChild: { type: Boolean, default: false },                                // 内部属性，用于递归子组件
  accordion: { type: Boolean, default: false },                              // 是否每次只打开一个同级树节点展开
  nodeKey: { type: String, default: null },                                  // 节点的唯一标识，理论上是整棵树的唯一
  highlightCurrent: { type: Boolean, default: false },                       // 是否高亮当前选中节点
  checkbox: { type: Boolean, default: false },                               // 是否显示树形复选框
  checkStrictly: { type: Boolean, default: false },                          // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
}

export default {}