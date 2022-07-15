export enum TimeRangePanelType {
  start = 'start',
  end = 'end',
}

export const TimePickerProps = {
  modelValue: { type: String },
  start: { type: [String, Number] },
  end: { type: [String, Number] },
  range: { type: Boolean }
}

export enum TimePanelLayout {
  h = 'hour',
  m = 'minute',
  s = 'second',
}

export const TimePublicProps = {
  displayFormat: { type: String, default: 'HH:mm:ss' },
  valueFormat: { type: String, default: 'HH:mm:ss' },
  max: { type: String },
  min: { type: String },
  layout: { type: Array, default: () => (['h', 'm', 's']) },
  custom: Function,
  checkDisabled: Function,
}

export const globalConfig = {
  size: 24
} as {
  size: number
}

export const TimePanelProps = {
  modelValue: { type: String },
  start: { type: String },
  end: { type: String },
  range: { type: Boolean },
  ...TimePublicProps,
}