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
  selected?: boolean,
  check?: boolean
}

export type TableColumnRow = {
  $index: number,
  row: Record<string, any>,
  _id: string
} & ColumnProp

export enum TableAlignEnum {
  Left = 'left',
  cneter = 'center',
  right = 'right'
}