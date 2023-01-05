import { PropType } from "vue";
import { TreeItems } from "../type";

export const TreeProps = {
  data: { type: Array as PropType<TreeItems>, default: [] },
  props: { type: Object as PropType<Record<string, string>> },
  defaultExpandAll: { type: Boolean, default: false },
  isChild: { type: Boolean, default: false }
}

export default {}