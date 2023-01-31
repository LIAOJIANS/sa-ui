import { PropType } from "vue";
import { DataProps, TreeItems } from "../type";

export const TreeProps = {
  data: { type: Array as PropType<TreeItems>, default: [] },                 // 树形数据
  props: { type: Object as PropType<DataProps> },                            // 自定义节点结构
  defaultExpandAll: { type: Boolean, default: false },                       // 是否展开所有节点, 优先级高于accordion
  isChild: { type: Boolean, default: false },                                // 内部属性，用于递归子组件
  accordion: { type: Boolean, default: false },                              // 是否每次只打开一个同级树节点展开
  nodeKey: { type: String, default: null },                                  // 节点的唯一标识，理论上是整棵树的唯一
  highlightCurrent: { type: Boolean, default: false },                        // 是否高亮当前选中节点
}

export default {}