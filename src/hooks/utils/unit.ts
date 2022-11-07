

export function unit (
  num: string | number | undefined | null,
  unit = 'px'
): string | null {

  if (num == null) {
    return null
  }

  if (/^[-+]?[0-9]*\.?[0-9]+$/.test(String(num))) {
    return `${num}${unit}`
  }

  return String(num)
}

export function removeUnit (
  num: string | number | undefined | null,
  unit = 'px'
): string {
  if(!num) {
    return ''
  }
  
  const data = String(num)
  return data.indexOf(unit) > -1 ? data.replace(unit, '') : data
}