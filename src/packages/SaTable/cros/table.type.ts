import { CSSProperties } from "vue";

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
  sortable?: boolean,
  fixed: FixedStatusEnum
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
  left = 'left',
  center = 'center',
  right = 'right'
}

export enum SortableStatusEnum {
  Asce = "ascending",
  Desc = 'descending'
}

export enum FixedStatusEnum {
  left = 'left',
  right = 'right'
}

export type SpanMethods = ( row: Record<string, string>, column: any, rowIndex: number, columnIndex: number ) => number[] & {
  rowspan: number,
  colspan: number
}