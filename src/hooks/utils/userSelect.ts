

export const disabledUserSelect = (): void => { // 启用全局选择文字功能
  document.body.style.userSelect = 'none';
}

export const enableUserSelect = (): void => { // 禁用
  document.body.style.userSelect = ''
}