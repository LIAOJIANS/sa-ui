
type FindOne = {
  <T>(arr: T[] | null | undefined, judgement: (item: T, index: number) => boolean): { item: T | null },
  <T>(arr: T[] | null | undefined, judgement: (item: T, index: number) => boolean, index: boolean): { item: T, index: number } | { item: null }
}

export const findOne: FindOne = <T>(
  arr: T[] | null | undefined,
  judgement: (item: T, index: number) => boolean,
  index?: boolean
) => {
  if (!arr || arr.length === 0) {
    return { item: null }
  }

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const flag = judgement(item, i)
    if (flag) {
      return !!index ? { item, index: i } : { item }
    }
  }

  return { item: null }
}
