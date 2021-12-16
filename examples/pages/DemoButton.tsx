// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaButton, SaDrawerCard, SaTitle } from 'sa-ui'
import { useRefs } from "src/hooks";
import { clipboard } from "src/hooks/utils/clipboard";

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
      <SaButton> 大 </SaButton>
      <SaButton> 中 </SaButton>
      <SaButton> 小 </SaButton>
      `
    })

    return () => <div>
      <h1 style={{ color: '#333' }}>Button 按钮</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>常用的操作按钮</span>

      <SaTitle mode={{ type: 'vline', direction: 'left' }} style={{ margin: '30px 0' }}>基础用法</SaTitle>
      <p style={{ margin: '10px 0' }}></p>
      <SaDrawerCard
        v-model={state.showContent}
        animation
        title={['收起代码', '展开代码']}
      >
        <div slot="title">
          <SaButton> 默认按钮 </SaButton>
          <SaButton status="success" style={{ marginLeft: '10px' }}> 成功按钮 </SaButton>
          <SaButton status="warn" style={{ marginLeft: '10px' }}> 警告按钮 </SaButton>
          <SaButton status="info" style={{ marginLeft: '10px' }}> 信息按钮 </SaButton>
          <SaButton status="error" style={{ marginLeft: '10px' }}> 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaButton mode="plain"> 空屡按钮 </SaButton>
          <SaButton mode="plain" status="success" style={{ marginLeft: '10px' }}> 成功按钮 </SaButton>
          <SaButton mode="plain" status="warn" style={{ marginLeft: '10px' }}> 警告按钮 </SaButton>
          <SaButton mode="plain" status="info" style={{ marginLeft: '10px' }}> 信息按钮 </SaButton>
          <SaButton mode="plain" status="error" style={{ marginLeft: '10px' }}> 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaButton mode="plain" shape="round"> 圆角按钮 </SaButton>
          <SaButton mode="plain" status="success" shape="round" style={{ marginLeft: '10px' }}> 成功按钮 </SaButton>
          <SaButton mode="plain" status="warn" shape="round" style={{ marginLeft: '10px' }}> 警告按钮 </SaButton>
          <SaButton mode="plain" status="info" shape="round" style={{ marginLeft: '10px' }}> 信息按钮 </SaButton>
          <SaButton mode="plain" status="error" shape="round" style={{ marginLeft: '10px' }}> 错误按钮 </SaButton>
          <p style={{ margin: '10px 0' }}></p>


          <SaButton status="success" icon="el-icon-edit" shape="round" lable="编辑" />
          <SaButton icon="el-icon-search" style={{ marginLeft: '10px' }} >搜索</SaButton>
          <SaButton icon="el-icon-search" style={{ marginLeft: '10px' }} shape="round" tip="搜索" />
          <SaButton status="success" icon="el-icon-edit" style={{ marginLeft: '10px' }} shape="round" tip="编辑" />
          <SaButton status="warn" icon="el-icon-more" style={{ marginLeft: '10px' }} shape="round" tip="更多" />
          <SaButton status="info" icon="el-icon-warning" shape="round" style={{ marginLeft: '10px' }} tip="信息" />
          <SaButton status="error" icon="el-icon-delete" shape="round" style={{ marginLeft: '10px' }} tip="删除" />
        </div>

        <div slot="content" v-highlight style={{ padding: '20px', position: 'relative' }}>
          <SaButton mode="text" style={{ position: 'absolute', right: '1%', top: '1%' }} onClick={e => clipboard(state.initBtnText, refs.initBtn)}>复制</SaButton>
          <pre ref={onRef.initBtn}>
            <code class="language-html" v-text={state.initBtnText}>
            </code>
          </pre>
        </div>
      </SaDrawerCard>


      <SaTitle mode={{ type: 'vline', direction: 'left' }} style={{ margin: '30px 0' }}>尺寸</SaTitle>
      <p style={{ margin: '10px 0' }}></p>

      <SaDrawerCard
        animation
        title={['收起代码', '展开代码']}
      >
        <div slot="title">
          <SaButton size="large" style={{ marginLeft: '10px' }}> 大 </SaButton>
          <SaButton size="normal" style={{ marginLeft: '10px' }}> 中 </SaButton>
          <SaButton size="mini" style={{ marginLeft: '10px' }}> 小 </SaButton>
        </div>

        <div slot="content" v-highlight style={{ padding: '20px', position: 'relative' }}>
          <SaButton mode="text" style={{ position: 'absolute', right: '1%', top: '1%' }} onClick={e => clipboard(state.initBtnText, refs.initBtn)}>复制</SaButton>
          <pre ref={onRef.initBtn}>
            <code class="language-html" v-text={state.sizeBtnText}>
            </code>
          </pre>
        </div>
      </SaDrawerCard>
    </div>
  }
})