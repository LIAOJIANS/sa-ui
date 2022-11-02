// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaButton, SaDrawerCard, SaTitle } from 'sa-ui'
import { useRefs } from "src/hooks";
import { clipboard } from "src/hooks/utils/clipboard";
import DemoContainer from '../components/container'

export default defineComponent({
  setup() {
    const { onRef, refs } = useRefs({
      initBtn: HTMLElement
    })

    const state = reactive({
      showContent: false,
      initBtnText: `
      <SaButton> 默认按钮 </SaButton>
      <SaButton status="success"> 成功按钮 </SaButton>
      <SaButton status="warn"> 警告按钮 </SaButton>
      <SaButton status="info"> 信息按钮 </SaButton>
      <SaButton status="error"> 错误按钮 </SaButton>

      <SaButton mode="plain"> 空屡按钮 </SaButton>
      <SaButton mode="plain" status="success" > 成功按钮 </SaButton>
      <SaButton mode="plain" status="warn" > 警告按钮 </SaButton>
      <SaButton mode="plain" status="info" > 信息按钮 </SaButton>
      <SaButton mode="plain" status="error" > 错误按钮 </SaButton>

      <SaButton mode="plain" shape="round"> 圆角按钮 </SaButton>
      <SaButton mode="plain" status="success" shape="round"> 成功按钮 </SaButton>
      <SaButton mode="plain" status="warn" shape="round" > 警告按钮 </SaButton>
      <SaButton mode="plain" status="info" shape="round" > 信息按钮 </SaButton>
      <SaButton mode="plain" status="error" shape="round" > 错误按钮 </SaButton>

      <SaButton status="success" icon="el-icon-edit" shape="round" lable="编辑" />
      <SaButton icon="el-icon-search" >搜索</SaButton>
      <SaButton icon="el-icon-search"  shape="round" tips="搜索" />
      <SaButton status="success" icon="el-icon-edit" shape="round" tips="编辑" />
      <SaButton status="warn" icon="el-icon-more" shape="round" tips="更多" />
      <SaButton status="info" icon="el-icon-warning" shape="round" tips="信息" />
      <SaButton status="error" icon="el-icon-delete" shape="round"  tips="删除" />
      `,

      sizeBtnText: `
      <SaButton size="large"> 大 </SaButton>
      <SaButton size="normal"> 中 </SaButton>
      <SaButton size="mini"> 小 </SaButton>
      `,

      disabledText: `
      <SaButton disabled> 默认按钮 </SaButton>
      <SaButton disabled icon="el-icon-search" >搜索</SaButton>
      `,

      textText: `
      <SaButton mode="text" > 成功按钮 </SaButton>
      <SaButton mode="text" status="success"> 成功按钮 </SaButton>
      <SaButton mode="text" status="warn"> 警告按钮 </SaButton>
      <SaButton mode="text" status="info"> 信息按钮 </SaButton>
      <SaButton mode="text" status="error"> 错误按钮 </SaButton>
      `,

      loadingText: `
      <SaButton loading> loading </SaButton>
      <SaButton mode="plain" shape="round" loading> loading </SaButton>
      <SaButton icon="el-icon-search" loading />
      <SaButton icon="el-icon-search" shape="round" loading />
      <SaButton mode="plain" icon="el-icon-search" loading />
      <SaButton mode="plain" icon="el-icon-search" shape="round" loading />
      <SaButton mode="text" loading />
      `
    })

    return () => <div>
      <h1 style={{ color: '#333' }}>Button 按钮</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>常用的操作按钮</span>

      <DemoContainer
        label="基础用法"
        describe="按钮的一些基本用法"
        codeText={state.initBtnText}
      >
        <div slot="title">

          <SaButton> 默认按钮 </SaButton>
          <SaButton status="success"> 成功按钮 </SaButton>
          <SaButton status="warn" > 警告按钮 </SaButton>
          <SaButton status="info" > 信息按钮 </SaButton>
          <SaButton status="error" > 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaButton mode="plain"> 空屡按钮 </SaButton>
          <SaButton mode="plain" status="success"> 成功按钮 </SaButton>
          <SaButton mode="plain" status="warn"> 警告按钮 </SaButton>
          <SaButton mode="plain" status="info"> 信息按钮 </SaButton>
          <SaButton mode="plain" status="error"> 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaButton mode="plain" shape="round"> 圆角按钮 </SaButton>
          <SaButton mode="plain" status="success" shape="round"> 成功按钮 </SaButton>
          <SaButton mode="plain" status="warn" shape="round"> 警告按钮 </SaButton>
          <SaButton mode="plain" status="info" shape="round"> 信息按钮 </SaButton>
          <SaButton mode="plain" status="error" shape="round"> 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaButton status="success" icon="el-icon-edit" shape="round" lable="编辑" />
          <SaButton icon="el-icon-search" >搜索</SaButton>
          <SaButton icon="el-icon-search" shape="round" tip="搜索" />
          <SaButton status="success" icon="el-icon-edit" shape="round" tip="编辑" />
          <SaButton status="warn" icon="el-icon-more" shape="round" tip="更多" />
          <SaButton status="info" icon="el-icon-warning" shape="round" tip="信息" />
          <SaButton status="error" icon="el-icon-delete" shape="round" tip="删除" />
        </div>
      </DemoContainer>

      <DemoContainer
        label="文字按钮"
        describe="各种类型的文字按钮"
        codeText={state.textText}
      >
        <div slot="title">
          <SaButton mode="text" > 成功按钮 </SaButton>
          <SaButton mode="text" status="success"> 成功按钮 </SaButton>
          <SaButton mode="text" status="warn"> 警告按钮 </SaButton>
          <SaButton mode="text" status="info"> 信息按钮 </SaButton>
          <SaButton mode="text" status="error"> 错误按钮 </SaButton>
        </div>
      </DemoContainer>

      <DemoContainer
        label="尺寸"
        describe="Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。"
        codeText={state.sizeBtnText}
      >
        <div slot="title">
          <SaButton size="large"> 大 </SaButton>
          <SaButton size="normal"> 中 </SaButton>
          <SaButton size="mini"> 小 </SaButton>
        </div>
      </DemoContainer>

      <DemoContainer
        label="禁用按钮"
        describe="按钮的不可用状态"
        codeText={state.disabledText}
      >
        <div slot="title">
          <SaButton disabled> 默认按钮 </SaButton>
          <SaButton disabled icon="el-icon-search" >搜索</SaButton>
          <SaButton disabled mode="text" > 默认按钮 </SaButton>
        </div>
      </DemoContainer>

      <DemoContainer
        label="loading 按钮"
        describe="按钮的loading状态"
        codeText={state.loadingText}
      >
        <div slot="title">
          <SaButton loading> loading </SaButton>
          <SaButton mode="plain" shape="round" loading> loading </SaButton>
          <SaButton icon="el-icon-search" loading />
          <SaButton icon="el-icon-search" shape="round" loading />
          <SaButton mode="plain" icon="el-icon-search" loading />
          <SaButton mode="plain" icon="el-icon-search" shape="round" loading />
          <SaButton mode="text" loading />
        </div>
      </DemoContainer>
    </div>
  }
})