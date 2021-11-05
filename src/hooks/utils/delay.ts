

export const delay = <T>(dur: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, dur)
  })
}