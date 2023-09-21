import { CSSProperties, VNode } from "vue";

export interface TabelStyle {
  thead: CSSProperties,
  tbody: CSSProperties
} 

export interface ColumnProp {
  label: string,
  prop: string,
  type?: string,
  width?: number | string,
  align?: TableAlignEnum,
  selected?: boolean
}

export type TableColumnRow = {
  $index: number,
  columnIndex: number,
  row: Record<string, string>,
  props: ColumnProp
  _id: string,
  check?: boolean
}

export enum TableAlignEnum {
  Left = 'left',
  cneter = 'center',
  right = 'right'
}