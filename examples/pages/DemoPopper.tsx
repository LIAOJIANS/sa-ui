// @ts-nocheck

import { defineComponent, reactive, ref } from "vue";
import { SaPopper, SaButton, SaInput, SaTitle, SaIcon } from 'sa-ui'
import DemoContainer from '../components/container'


export default defineComponent({
  setup() {

    const popperState = ref(false)


    const state = reactive({
      initText: `
      <SaPopper
        message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        title="标题"
      >
        <SaButton onClick={handler.showPopper}>hover激活</SaButton>
      </SaPopper>

      <SaPopper
        message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        title="标题"
        tirgger="click"
      >
        <SaButton status="primary" >click激活</SaButton>
      </SaPopper>

      <SaPopper
        message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        title="标题"
        tirgger="focus"
      >
        <SaButton status="primary" >focus激活</SaButton>
      </SaPopper>

      <SaPopper
        message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        title="标题"
        tirgger="manual"
      >
        <SaButton status="primary" >手动激活</SaButton>
      </SaPopper>
      `,

      showContent: false,
      inputValue: ''
    })

    const handler = {
      showPopper: () => {
        popperState.value = true
      }
    }

    return () => <div>
      <h1 style={{ color: '#333' }}>Popper 按钮</h1>

      <DemoContainer
        label="基本用法"
        describe="Popper 的属性与 Tooltip 很类似，它们都是基于Vue-popper开发的，因此对于重复属性，请参考 Tooltip 的文档，在此文档中不做详尽解释。"
        codeText={ state.initText }
      >
      <div slot="title">
          <SaPopper
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
          >
            <SaButton onClick={handler.showPopper}>hover激活</SaButton>
          </SaPopper>

          <SaPopper
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
            tirgger="click"
          >
            <SaButton status="primary" >click激活</SaButton>
          </SaPopper>

          <SaPopper
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
            tirgger="focus"
          >
            <SaButton status="primary" >focus激活</SaButton>
          </SaPopper>

          <SaPopper
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
            tirgger="manual"
          >
            <SaButton status="primary" >手动激活</SaButton>
          </SaPopper>


          {/* <SaPopper
           tirgger="click"
            v-slots={{
              default: () => <SaButton status="primary"  >自定义popper</SaButton>,
              head: () => <> <div>
                <SaTitle
                  direction='left'
                  mode='hline'
                >
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <p>请输入时间</p>
                    <SaIcon icon="el-icon-circle-plus" />
                  </div>
                </SaTitle>
              </div> </>,
              popper: () => <>
                <SaInput
                  v-model={state.inputValue}
                  type='time'
                />
              </>
            }}
          >
            <div>
              1
            </div>
          </SaPopper> */}

        </div>
      </DemoContainer>
    </div>
  }
})