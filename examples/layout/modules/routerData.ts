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
      { name: 'Index', title: '基本信息', page: '/index', complete: false },
      { name: 'Icon', title: '图标', page: '/DemoIcon', complete: true},
      { name: 'Grid', title: '栅格布局', page: '/DemoGrid', complete: true },
    ]
  },

  {
    name: '组件',
    childrens: [
      { name: 'Title', title: '标题', page: '/DemoTitle', complete: true},
      { name: 'DrawerCard', title: '卡片抽屉', page: '/DemoDrawerCard', complete: true },
      { name: 'Tooltip', title: '文字提示', page: '/DemoTooltip', complete: true },
      { name: 'Popper', title: 'popper气泡', page: '/DemoPopper', complete: true },
      { name: 'Buttom', title: '按钮', page: '/DemoButton', complete: true },
      { name: 'Dropdown', title: '下拉菜单', page: '/DemoDropdown', complete: true },
      { name: 'Scroll', title: '滚动组件', page: '/DemoScroll', complete: true },
      { name: 'Radio', title: 'Radio单选框', page: '/DemoRadio', complete: true },
      { name: 'CheckBox', title: 'CheckBox多选框', page: '/DemoCheckBox', complete: true },
      { name: 'Collapse', title: 'Collapse折叠面板', page: '/DemoCollapse', complete: true },
      { name: 'Transfer', title: 'Transfer穿梭框', page: '/DemoTransfer', complete: true },
      { name: 'Tag', title: 'Tag 标签', page: '/DemoTag', complete: true },
      { name: 'LoadingMask', title: 'Loading遮罩层', page: '/DemoLoadingMask', complete: true },
      { name: 'TimePicker', title: 'TimePicker时间组件', page: '/DemoTimePicker', complete: true },
      { name: 'TimeLine', title: '时间线', page: '/DemoTimeLine.tsx', complete: true },
      { name: 'Card', title: 'Card卡片', page: '/DemoCard', complete: true },
      { name: 'Progress', title: 'Progress进度条', page: '/DemoProgress', complete: true },
    ]
  },

  
  {
    name: '表单组件',
    childrens: [
      { name: 'Input', title: '文本框', page: '/DemoInput', complete: true},
      { name: 'Select', title: '选择器', page: '/DemoSelect', complete: true },
      { name: 'Form', title: 'Form表单', page: '/DemoForm', complete: true }
    ]
  },

  {
    name: '消息弹窗组件',
    childrens: [
      { name: 'Message', title: '消息提示', page: '/DemoMessage', complete: true},
      { name: 'Dialog', title: 'dialog弹窗', page: '/DemoDialog', complete: true }
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