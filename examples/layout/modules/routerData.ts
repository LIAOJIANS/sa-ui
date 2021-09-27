import { reactive } from "vue"

import { Router } from './router'

interface IRoutesData {
  name: string
  childrens: IRoutesDataChilds[]
}

interface IRoutesDataChilds {
  name: string
  title?: string
  page: string
  complete?: boolean
}


const routes: IRoutesData[] = [
  {
    name: '基础',
    childrens: [
      { name: 'Icon', title: '图标', page: '/DemoIcon', complete: true}
    ]
  },

  
  {
    name: '表单组件',
    childrens: [
      { name: 'Input', title: '文本框', page: '/DemoInput', complete: true}
    ]
  }
]

export const Menu = (() => {
  const state = reactive({
    data: routes,
    openMenu: (menu: IRoutesDataChilds) => Router.go(menu.page)
  })

  return state
})()