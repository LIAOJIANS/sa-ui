

export  const nextIndex = (() =>  {
  let count = 1500
  return () => count++
})()