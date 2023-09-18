import { CSSProperties, VNode } from "vue";

export interface TabelStyle {
  thead: CSSProperties,
  tbody: CSSProperties
} 

export interface ColumnProp {
  label: string | VNode,
  prop: string,
  type: 'index' | 'default',
  width: number | string,
  align: TableAlignEnum
}

export type TableColumnRow = {
  $index: number,
  row: Record<string, any>
}

export enum TableAlignEnum {
  Left = 'left',
  cneter = 'center',
  right = 'right'
}