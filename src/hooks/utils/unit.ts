

export default function unit (
  num: string | number | undefined | null,
  unit = 'px'
): string | null {

  if (!num) {
    return null
  }

  if (/^-?[\d]+$/.test(String(num))) {
    return `${num}${unit}`
  }

  return String(num)
}