// @ts-nocheck

import { defineComponent, reactive} from "vue";
import { SaPopper, SaButton, SaInput, SaTitle, SaIcon } from 'sa-ui'
import DemoContainer from '../components/container'


export default defineComponent({
  setup() {


    const state = reactive({
      initText: `
      import { defineComponent, reactive } from "vue";
      import { SaPopper, SaButton } from 'sa-ui'
      export default defineComponent({
        setup() {
          const state = reactive({ popperState: false })

          return () => <>
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
              v-model={ state.popperState }
              message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
              title="标题"
              tirgger="manual"
            >
              <SaButton status="primary" onClick={() => (state.popperState = !state.popperState)} >手动激活</SaButton>
            </SaPopper>
          </>
        }
      })
      `,

      initCustomText: `
      import { defineComponent, reactive } from "vue";
      import { SaPopper, SaButton, SaInput, SaTitle, SaIcon } from 'sa-ui'
      export default defineComponent({
        setup() {
          const state = reactive({ 
            customPopperState: false,
            inputValue: ''
          })

          const handler = {
            subCustomPopper: () => {
              console.log(state.inputValue); // inputValue
              
              state.customPopperState = false
            }
          }

          return () => <>
            <SaPopper
              tirgger="manual"
              v-model={state.customPopperState}
              v-slots={{
                default: () => <SaButton status="primary" onClick={() => state.customPopperState = true}  >自定义popper</SaButton>,
                head: () => <> <div>
                  <SaTitle
                    direction='left'
                    mode='hline'
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', padding: '0 10px' }}>
                      <p>请输入时间</p>
                      <SaIcon icon="el-icon-circle-plus" />
                    </div>
                  </SaTitle>
                </div> </>,
                popper: () => <>
                  <SaInput
                    v-model={state.inputValue}
                    type='time'
                    clearIcon
                  />
                  <p style={{ margin: '10px 0' }}></p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaButton mode="text" size="mini" onClick={() => state.customPopperState = false}>取消</SaButton>
                    <SaButton size="mini" noPadding onClick={handler.subCustomPopper}>确定</SaButton>
                  </div>
                </>
              }}
            />
          </>
        }
      })
      `,

      popperState: false,
      customPopperState: false,
      inputValue: ''
    })

    const handler = {
      showPopper: () => {
        state.popperState = !state.popperState
      },

      subCustomPopper: () => {
        console.log(state.inputValue);
        
        state.customPopperState = false
      }
    }

    return () => <>
      <h1 style={{ color: '#333' }}>Popper 按钮</h1>

      <DemoContainer
        label="基本用法"
        describe="Popper 的属性与 Tooltip 很类似，它们都是基于Vue-popper开发的，因此对于重复属性，请参考 Tooltip 的文档，在此文档中不做详尽解释。"
        codeText={state.initText}
      >
        <div slot="title">
          <SaPopper
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
          >
            <SaButton >hover激活</SaButton>
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
            v-model={state.popperState}
            message="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            title="标题"
            tirgger="manual"
          >
            <SaButton status="primary" onClick={handler.showPopper} >手动激活</SaButton>
          </SaPopper>
        </div>
      </DemoContainer>

      <DemoContainer
        label="嵌套信息"
        describe="可以在 Popover 中嵌套多种类型信息。"
        codeText={state.initCustomText}
      >
        <div slot="title">
          <SaPopper
            tirgger="manual"
            v-model={state.customPopperState}
            onShow={() => console.log('出现') }
            onHide={() => console.log('消失')}
            v-slots={{
              default: () => <SaButton status="primary" onClick={() => state.customPopperState = true}  >自定义popper</SaButton>,
              head: () => <> <div>
                <SaTitle
                  direction='left'
                  mode='hline'
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', padding: '0 10px' }}>
                    <p>请输入时间</p>
                    <SaIcon icon="el-icon-circle-plus" />
                  </div>
                </SaTitle>
              </div> </>,
              popper: () => <>
                <SaInput
                  v-model={state.inputValue}
                  type='time'
                  clearIcon
                />
                <p style={{ margin: '10px 0' }}></p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaButton mode="text" size="mini" onClick={() => state.customPopperState = false}>取消</SaButton>
                  <SaButton size="mini" noPadding onClick={handler.subCustomPopper}>确定</SaButton>
                </div>
              </>
            }}
          />
        </div>

      </DemoContainer>
    </>
  }
})